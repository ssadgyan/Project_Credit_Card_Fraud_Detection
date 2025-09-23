from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pymongo
import bcrypt
import jwt
import datetime
from config import MONGO_URI, JWT_SECRET, JWT_ALGO

# Init Flask
app = Flask(__name__)
CORS(app)

# MongoDB setup
client = pymongo.MongoClient(MONGO_URI)
db = client["fraud_detection"]
users_collection = db["users"]

# Load trained ML model
model = joblib.load("credit_card_model.pkl")


# ---------------- AUTH UTILS ---------------- #
def create_token(email):
    payload = {
        "email": email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def verify_token(token):
    try:
        decoded = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
        return decoded
    except Exception as e:
        return None


# ---------------- ROUTES ---------------- #
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password").encode("utf-8")

    if users_collection.find_one({"email": email}):
        return jsonify({"msg": "User already exists"}), 400

    hashed_pw = bcrypt.hashpw(password, bcrypt.gensalt())
    users_collection.insert_one({"email": email, "password": hashed_pw})
    return jsonify({"msg": "Signup successful"}), 201


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password").encode("utf-8")

    user = users_collection.find_one({"email": email})
    if user and bcrypt.checkpw(password, user["password"]):
        token = create_token(email)
        return jsonify({"msg": "Login successful", "token": token})
    else:
        return jsonify({"msg": "Invalid credentials"}), 401


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
    return jsonify({"prediction": int(prediction[0])})


if __name__ == "__main__":
    app.run(debug=True)