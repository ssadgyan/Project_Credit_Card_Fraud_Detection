import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

// Typewriter hook
function useTypewriter(words, speed = 150, pause = 2000) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let typing;
    const current = words[wordIndex];

    if (!isDeleting) {
      typing = setTimeout(() => {
        setText(current.slice(0, index + 1));
        setIndex(index + 1);
        if (index + 1 === current.length) {
          setIsDeleting(true);
        }
      }, speed);
    } else {
      typing = setTimeout(() => {
        setText(current.slice(0, index - 1));
        setIndex(index - 1);
        if (index - 1 === 0) {
          setIsDeleting(false);
          setWordIndex((wordIndex + 1) % words.length);
        }
      }, speed / 2);
    }

    return () => clearTimeout(typing);
  }, [index, isDeleting, wordIndex, words, speed]);

  return text;
}

function Home() {
  const navigate = useNavigate();
  const typedText = useTypewriter(
    ["Detect Fraud Instantly.", "Prevent Losses.", "Protect Customers."],
    150,
    2000
  );

  return (
    <div
      style={{
        textAlign: "center",
        minHeight: "100vh",
        background: "linear-gradient(-45deg, #87CEFA, #f5f7fa, #9ad0ec, #bde0fe)",
        backgroundSize: "400% 400%",
        animation: "gradientBG 12s ease infinite",
        padding: "30px"
      }}
    >
      {/* Title */}
      <h1 style={{ fontSize: "48px", color: "#2c3e50", fontWeight: "bold" }}>
        🚨 Welcome to <span style={{ color: "#0879bf" }}>Fraud Guardian</span> 🚨
      </h1>

      {/* Typewriter Effect */}
      <h2 style={{ marginTop: "10px", fontSize: "22px", color: "#444", minHeight: "30px" }}>
        {typedText}
        <span style={{ borderRight: "2px solid #0879bf", marginLeft: "2px" }} />
      </h2>

      {/* Project Description */}
      <p
        style={{
          fontSize: "18px",
          marginTop: "20px",
          maxWidth: "750px",
          margin: "20px auto",
          lineHeight: "1.8",
          color: "#333"
        }}
      >
        Fraud Guardian is an intelligent system designed to detect fraudulent credit card transactions
        in real-time using advanced machine learning algorithms.  
        This project empowers financial institutions 👨‍💻💳 to safeguard against fraud and build trust with customers.
      </p>

      {/* 🚀 Get Started Button */}
      <button
        onClick={() => navigate("/login")}
        style={{
          background: "#0879bf",
          color: "white",
          padding: "14px 25px",
          fontSize: "18px",
          border: "none",
          borderRadius: "8px",
          marginTop: "30px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          transition: "0.3s"
        }}
      >
        🚀 Get Started
      </button>

      {/* Features Section */}
      <h2 style={{ marginTop: "40px", color: "#2c3e50" }}>✨ Key Features</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          maxWidth: "1000px",
          margin: "20px auto"
        }}
      >
        <Card style={{ background: "#f9f9f9", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <Typography variant="h6" style={{ color: "#0879bf", fontWeight: "bold" }}>
              🔐 Secure Login
            </Typography>
            <Typography variant="body2" style={{ marginTop: "10px" }}>
            </Typography>
          </CardContent>
        </Card>

        <Card style={{ background: "#f9f9f9", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <Typography variant="h6" style={{ color: "#0879bf", fontWeight: "bold" }}>
              🤖 Smart Predictions
            </Typography>
            <Typography variant="body2" style={{ marginTop: "10px" }}>
            </Typography>
          </CardContent>
        </Card>

        <Card style={{ background: "#f9f9f9", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <Typography variant="h6" style={{ color: "#0879bf", fontWeight: "bold" }}>
              💬 Help AI Assistant
            </Typography>
            <Typography variant="body2" style={{ marginTop: "10px" }}>
            </Typography>
          </CardContent>
        </Card>

        <Card style={{ background: "#f9f9f9", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <CardContent>
            <Typography variant="h6" style={{ color: "#0879bf", fontWeight: "bold" }}>
              📊 Real Dataset
            </Typography>
            <Typography variant="body2" style={{ marginTop: "10px" }}>
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer style={{ marginTop: "60px", padding: "20px", background: "#f1f1f1" }}>
        <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
          © 2025 Fraud Guardian 
        </p>
      </footer>

      {/* 🌀 Gradient Animation */}
      <style>
        {`
          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
}

export default Home;