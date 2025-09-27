import React, { useState } from "react";
import API from "../api";
import { Tooltip } from "@mui/material";   // 👈 Tooltip import

function Predict() {
  const [features, setFeatures] = useState(Array(29).fill(""));
  const [result, setResult] = useState("");
  const [probability, setProbability] = useState(null);  // 👈 probability state

  // Feature descriptions (for tooltips)
  const featureDescriptions = [
    "V1 - PCA transformed feature",
    "V2 - PCA transformed feature",
    "V3 - PCA transformed feature",
    "V4 - PCA transformed feature",
    "V5 - PCA transformed feature",
    "V6 - PCA transformed feature",
    "V7 - PCA transformed feature",
    "V8 - PCA transformed feature",
    "V9 - PCA transformed feature",
    "V10 - PCA transformed feature",
    "V11 - PCA transformed feature",
    "V12 - PCA transformed feature",
    "V13 - PCA transformed feature",
    "V14 - PCA transformed feature",
    "V15 - PCA transformed feature",
    "V16 - PCA transformed feature",
    "V17 - PCA transformed feature",
    "V18 - PCA transformed feature",
    "V19 - PCA transformed feature",
    "V20 - PCA transformed feature",
    "V21 - PCA transformed feature",
    "V22 - PCA transformed feature",
    "V23 - PCA transformed feature",
    "V24 - PCA transformed feature",
    "V25 - PCA transformed feature",
    "V26 - PCA transformed feature",
    "V27 - PCA transformed feature",
    "V28 - PCA transformed feature",
    "Amount - Scaled transaction amount"
  ];

  // Sample values
  const fraudSample = [
    -2.3122, 1.9519, -1.6098, 3.9979, -0.5221,
    -1.4265, -2.5373, 1.3916, -2.7700, -2.7722,
    3.2020, -2.8999, -0.5952, -4.2892, 0.3897,
    -1.1407, -2.8300, -0.0168, 0.4169, 0.1269,
    0.5172, -0.0350, -0.4652, 0.3201, 0.0445,
    0.1778, 0.2611, -0.1432, -0.3532
  ];

  const normalSample = [
    -1.3598, -0.0727, 2.5363, 1.3781, -0.3383,
    0.4623, 0.2395, 0.0986, 0.3637, 0.0907,
    -0.5515, -0.6178, -0.9913, -0.3111, 1.4681,
    -0.4704, 0.2079, 0.0257, 0.4039, 0.2514,
    -0.0183, 0.2778, -0.1104, 0.0669, 0.1285,
    -0.1891, 0.1335, -0.0210, 0.2449
  ];

  const handleChange = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  // Submit predict
  const handlePredict = async () => {
    try {
      const parsedFeatures = features.map(f => f === "" ? 0 : parseFloat(f));
      const res = await API.post("/predict", { features: parsedFeatures });

      setResult(res.data.prediction === 1 ? "⚠️ Fraud Transaction" : "✅ Normal Transaction");
      setProbability(res.data.fraud_probability);   // 👈 probability set
    } catch (err) {
      console.error(err);
      setResult("❌ Error: Please check inputs or login again.");
      setProbability(null);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Fraud Detection Prediction</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePredict();
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
            margin: "20px auto",
            maxWidth: "750px",
          }}
        >
          {features.map((value, index) => (
            <div key={index}>
              <Tooltip title={featureDescriptions[index]} arrow>
                <label style={{ fontWeight: "bold" }}>
                  V{index + 1}
                </label>
              </Tooltip>
              <input
                type="number"
                step="any"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "5px"
                }}
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          style={{
            background: "#0879bf",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            marginTop: "10px"
          }}
        >
          Predict
        </button>
      </form>

      {/* Extra Demo Buttons */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setFeatures(fraudSample)}>🔴 Use Fraud Sample</button>
        <button onClick={() => setFeatures(normalSample)}>🟢 Use Normal Sample</button>
        <button onClick={() => setFeatures(Array(29).fill(""))}>Clear Form</button>
      </div>

      {/* Result card */}
      {result && (
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              background: result.includes("Fraud") ? "#ffcccc" : "#ccffcc",
              border: `2px solid ${result.includes("Fraud") ? "red" : "green"}`,
              color: result.includes("Fraud") ? "red" : "green",
              padding: "20px 30px",
              borderRadius: "10px",
              fontSize: "20px",
              fontWeight: "bold",
              width: "fit-content",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <span>{result.includes("Fraud") ? "🚨" : "✅"} {result}</span>
            {probability !== null && (
              <span style={{ fontSize: "16px", color: "#333" }}>
                Fraud Probability: {(probability * 100).toFixed(2)}%
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Predict;