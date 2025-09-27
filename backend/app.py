from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, pymongo, bcrypt, jwt, datetime
from config import MONGO_URI, JWT_SECRET, JWT_ALGO

# Google Auth
from google.oauth2 import id_token
from google.auth.transport import requests as grequests

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# MongoDB setup
client = pymongo.MongoClient(MONGO_URI)
db = client["fraud_detection"]
users_collection = db["users"]

# Load trained ML model
model = joblib.load("credit_card_model.pkl")

# ---------------- AUTH UTILS ---------------- #
def create_token(email):
    payload = {"email": email, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

def verify_token(token):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except Exception:
        return None

# ---------------- ROUTES ---------------- #

# Signup
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email and password required"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"msg": "User already exists"}), 400

    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    users_collection.insert_one({"email": email, "password": hashed_pw})

    return jsonify({"msg": "Signup successful"}), 201


# Login
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email and password required"}), 400

    user = users_collection.find_one({"email": email})
    if user and bcrypt.checkpw(password.encode("utf-8"), user["password"].encode("utf-8")):
        token = create_token(email)
        return jsonify({"msg": "Login successful", "token": token})
    else:
        return jsonify({"msg": "Invalid credentials"}), 401


# Logout
@app.route("/logout", methods=["POST"])
def logout():
    # JWT is stateless, so backend just informs client to clear token
    return jsonify({"msg": "Logout successful, please clear token on client."}), 200


# Predict
@app.route("/predict", methods=["POST"])
def predict():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"msg": "Missing or invalid token"}), 401

    token = auth_header.split(" ")[1]
    user_data = verify_token(token)

    if not user_data:
        return jsonify({"msg": "Token invalid or expired"}), 401

    features = request.json.get("features")
    prediction = model.predict([features])
    proba = model.predict_proba([features])[0][1]  # fraud probability
    return jsonify({
        "prediction": int(prediction[0]),
        "fraud_probability": float(proba)
    })


# Google Login
@app.route("/google-login", methods=["POST"])
def google_login():
    token_id = request.json.get("tokenId")
    try:
        idinfo = id_token.verify_oauth2_token(
            token_id, grequests.Request(),"105149798415-0b8s1bet2k0c2uce5ga4rifdmp04s572.apps.googleusercontent.com"
        )
        email = idinfo['email']
        if not users_collection.find_one({"email": email}):
            users_collection.insert_one({"email": email})
        token = create_token(email)
        return jsonify({"msg": "Google login successful", "token": token})
    except Exception as e:
        return jsonify({"msg": "Google login failed", "error": str(e)}), 401


# ---------------- DYNAMIC CHATBOT ---------------- #

fraud_sample = [-2.3122265423263, 1.95199201064158, -1.60985073229769,
  3.9979055875468, -0.522187864667764, -1.42654531920595,
  -2.53738730624579, 1.39165724829804, -2.77008927719433,
  -2.77227214465915, 3.20203320709635, -2.89990738849473,
  -0.595221881324605, -4.28925378244217, 0.389724120274487,
  -1.14074717980657, -2.83005567450437, -0.0168224681808257,
  0.416955705037907, 0.126910559061474, 0.517232370861764,
  -0.0350493686052974, -0.465211076182388, 0.320198198514526,
  0.0445191674731724, 0.177839798284401, 0.261145002567677,
  -0.143275874698919, -0.35322939296682354]

normal_sample = [-1.3598071336738, -0.0727811733098497, 
  2.53634673796914, 1.37815522427443, -0.338320769942518, 
  0.462387777762292, 0.239598554061257, 0.0986979012610507, 
  0.363786969611213, 0.0907941719789316, -0.551599533260813,
  -0.617800855762348, -0.991389847235408, -0.311169353699879, 
  1.46817697209427, -0.470400525259478, 0.207971241929242, 
  0.0257905801985591, 0.403992960255733, 0.251412098239705, 
  -0.018306777944153, 0.277837575558899, -0.110473910188767, 
  0.0669280749146731, 0.128539358273528, -0.189114843888824, 
  0.133558376740387, -0.0210530534538215, 0.24496426337017338]


@app.route("/chatbot", methods=["POST"])
def chatbot():
    user_msg = request.json.get("message", "").lower()
    reply = "Sorry, I didn’t understand 🤔"

    if "hello" in user_msg or "hi" in user_msg:
        reply = "Hello 👋 I'm Help AI. Ask me about fraud detection app."
    elif "fraud" in user_msg and "sample" in user_msg:
        reply = f"Here is a fraud transaction sample:\n{fraud_sample}"
    elif "normal" in user_msg and "sample" in user_msg:
        reply = f"Here is a normal transaction sample:\n{normal_sample}"
    elif "predict" in user_msg:
        reply = "👉 Go to Predict page or ask me for a fraud/normal sample."
    elif "dataset" in user_msg:
        reply = "📊 We used the Kaggle credit card fraud dataset (284,807 transactions, 492 frauds)."
    elif "metrics" in user_msg or "accuracy" in user_msg:
        reply = "Our model (RandomForest + SMOTE) evaluates with Precision, Recall, F1, and AUC."
    elif "login" in user_msg:
        reply = "🔑 You can login with Email/Password or Google Sign-In."
    elif "contact" in user_msg or "support" in user_msg:
        reply = "📧 Reach us at support@frauddemo.com"

    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(debug=True)