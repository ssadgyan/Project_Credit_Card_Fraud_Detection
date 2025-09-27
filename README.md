# Project_Credit_Card_Fraud_Detection


## 📌 Project Overview
This project is an **end-to-end system** that detects fraudulent credit card transactions.  
We built:  
- 💻 **Frontend:** React + Material-UI (with Google Login + Help AI chatbot)  
- ⚙️ **Backend:** Flask + MongoDB + JWT Authentication  
- 🤖 **ML Model:** RandomForest with SMOTE for imbalanced dataset  
- 🤝 **Extra Features:** Google OAuth Login, Dynamic Chatbot (Help AI), Fraud/Normal demo samples

---

## 📊 Dataset
- Source: [Kaggle Credit Card Fraud Dataset](https://www.kaggle.com/mlg-ulb/creditcardfraud)  
- Transactions: **284,807**  
- Fraud cases: **492** (0.17%) → highly imbalanced dataset  

---

## 🧠 Model Training
1. Preprocessing  
   - Dropped `Time` column  
   - Scaled `Amount` column with `StandardScaler`  
   - Removed duplicates  

2. Class Imbalance  
   - Applied **SMOTE** (Synthetic Minority Oversampling Technique) on training set  

3. Algorithm  
   - Chose **RandomForestClassifier** (n_estimators=200, class_weight='balanced')  
   - Wrapped inside a **Pipeline** with scaler for safety  

4. Evaluation Metrics  
   - **Accuracy** is misleading (fraud << normal)  
   - Key metrics: Precision, Recall, F1, AUC-ROC  

5. Saving Model  
   - Saved trained model pipeline as `credit_card_model.pkl` (via `joblib.dump`)  
   - Loaded in Flask backend for real-time predictions  

---

## 🌍 Real Life Impact
- Detecting fraud is critical for banks & financial companies 💰  
- Prevents massive losses (fraudulent transactions cost **billions annually**)  
- Improves customer trust & reduces **false positives** (blocking genuine transactions)  
- Automated model reduces human monitoring workload significantly  

---

## ⚡ Features
- 🔐 User Authentication (Signup/Login + JWT Session)  
- 🔑 Google OAuth Login (Gmail Sign-in)  
- 📊 Fraud Detection via trained RandomForest model  
- ⚡ Predict tab: Enter 29 features manually OR use Fraud/Normal demo samples  
- 🤖 **Help AI Chatbot:**  
  - Answers about dataset, fraud detection, metrics etc.  
  - Provides ready **fraud/normal samples** for prediction testing  
- 📉 Output includes Fraud Probability score  

---

## 🚀 How To Run Locally

### Prerequisites
- Python 3.10+  
- Node.js + npm  
- MongoDB Atlas account  

---

### 1. Clone Repo
```bash
git clone https://github.com/your-username/credit_card_fraud_detection.git
cd credit_card_fraud_detection
2. Setup Backend (Flask)
Bash

cd backend
pip install -r requirements.txt
Start backend:

Bash

python app.py
👉 Backend runs on http://127.0.0.1:5000

3. Setup Frontend (React)
Bash

cd frontend
npm install
npm start
👉 Frontend runs on http://localhost:3000

4. Update Config
In backend/config.py: Add your MongoDB URI, JWT_SECRET, JWT_ALGO.
In frontend/src/index.js: Paste your Google OAuth Client ID.
🔎 How It Works
User visits app → can Signup/Login OR Google Sign-in
Token saved in localStorage → Navbar updates → Predict + Help AI available
Predict → User enters inputs (29 features) / uses Fraud/Normal demo → sends request → backend model predicts
Backend returns:
prediction: 0 → ✅ Normal Transaction
prediction: 1 → ⚠ Fraud Transaction
Fraud probability score
Help AI Chatbot → Assists user with dataset info, metrics, fraud/normal samples
📂 Project Structure
text

credit_card_fraud_detection/
│── backend/
│   ├── app.py                # Flask API + Authentication
│   ├── config.py             # Mongo URI + JWT Config
│   ├── requirements.txt      # Python dependencies
│   └── credit_card_model.pkl # Saved ML model
│
│── frontend/
│   ├── src/
│   │   ├── api.js            # Axios instance
│   │   ├── App.js            # Main React App + Routes + Navbar
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Predict.js
│   │   │   └── Chatbot.js
│   └── package.json
│
└── README.md





🎯 Example Demo
Fraud Demo Sample (from dataset):

prediction: 1
fraud_probability: 0.93
Normal Demo Sample:

prediction: 0
fraud_probability: 0.04


👨‍💻 Contributors

Developed by: Sadgyan singh / META
Domain: Machine Learning, Cybersecurity, FinTech
📌 Future Improvements
Deploy ML model & backend to Cloud (AWS/Heroku)
Use XGBoost / LightGBM for improved recall
Add Explainability (SHAP/LIME) for fraud reasons
Live streaming detection from bank transaction APIs


Thanks for using my project
