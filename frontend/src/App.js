import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Predict from "./components/Predict";
import Chatbot from "./components/Chatbot";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute"; 

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from "@mui/material/Typography";
import Container from '@mui/material/Container';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

/* ---------------- TYPEWRITER HOOK ---------------- */
function useTypewriter(words, speed = 150, pause = 2000) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentWord = words[wordIndex];

    if (!isDeleting && index < currentWord.length) {
      timer = setTimeout(() => setIndex(index + 1), speed);
    } else if (isDeleting && index > 0) {
      timer = setTimeout(() => setIndex(index - 1), speed / 2);
    } else {
      if (!isDeleting) {
        timer = setTimeout(() => setIsDeleting(true), pause);
      } else {
        setIsDeleting(false);
        setWordIndex((wordIndex + 1) % words.length);
      }
    }
    setText(currentWord.substring(0, index));

    return () => clearTimeout(timer);
  }, [index, isDeleting, wordIndex, words, speed, pause]);

  return text;
}

/* ---------------- NAVBAR ---------------- */
function Navbar({ isLoggedIn, handleLogout }) {
  const location = useLocation(); 
  const [open, setOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const buttonStyle = (path) => ({
    color: isActive(path) ? "white" : "black",
    backgroundColor: isActive(path) ? "#045a8d" : "transparent",
    marginLeft: "10px",
    fontWeight: isActive(path) ? "bold" : "normal"
  });

  const typedText = useTypewriter(
    ["Detect Fraud", "Prevent Losses", "Protect Customers"], 
    150, 
    2000
  );

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#87CEFA" }}>
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo + Brand + Tagline */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <img 
              src="/images/logo.png"
              alt="Fraud Guardian Logo"
              style={{ width: "45px", height: "45px", marginRight: "10px", borderRadius: "50%" }}
            />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Typography variant="h6" style={{ fontWeight: "bold", color: "black", lineHeight: "1.2" }}>
                Fraud Guardian
              </Typography>
              {/* Typewriter Animated Tagline */}
              <Typography
                variant="caption"
                className="animated-tagline"
                style={{
                  fontStyle: "italic",
                  fontSize: "13px",
                  background: "linear-gradient(90deg, #ff0000, #ff9900, #33cc33, #0099ff)",
                  backgroundSize: "300%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "gradientShift 5s infinite linear",
                  minHeight: "16px"
                }}
              >
                {typedText}
                <span style={{ borderRight: "2px solid #333", marginLeft: "2px" }} />
              </Typography>
            </div>
          </div>

          {/* Nav Buttons */}
          <div>
            <Button style={buttonStyle("/")} component={Link} to="/">Home</Button>
            {!isLoggedIn && (
              <>
                <Button style={buttonStyle("/login")} component={Link} to="/login">Login</Button>
                <Button style={buttonStyle("/signup")} component={Link} to="/signup">Signup</Button>
              </>
            )}
            {isLoggedIn && (
              <>
                <Button style={buttonStyle("/predict")} component={Link} to="/predict">Predict</Button>
                <Button style={buttonStyle("/chatbot")} component={Link} to="/chatbot">💬 Help AI</Button>
                <Button
                  style={{
                    marginLeft: "10px",
                    color: "red",
                    fontWeight: "bold",
                    border: "1px solid red"
                  }}
                  onClick={() => setOpen(true)}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {/* Confirm Logout Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            style={{ color: "red", fontWeight: "bold" }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* CSS for Gradient Animation */}
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </>
  );
}


/* ---------------- APP ---------------- */
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkLoginStatus = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <Container style={{ marginTop: "40px" }}>
        <Routes>
          <Route path="/" element={<Home />} />      
          <Route path="/login" element={<Login />} />  
          <Route path="/signup" element={<Signup />} />
          <Route path="/predict" element={<ProtectedRoute><Predict /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;