import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button
} from "@mui/material";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await API.post("/signup", { email, password });
      setMsg("Signup successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login"); // ✅ Redirect to login
      }, 1500);
    } catch (err) {
      setMsg("Error: User already exists.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <Card style={{ maxWidth: 400, width: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
        <CardContent>
          <Typography variant="h5" style={{ textAlign: "center", marginBottom: "20px", fontWeight: "bold" }}>
            📝 Signup
          </Typography>

          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            style={{ marginTop: "20px", backgroundColor: "#0879bf" }}
            onClick={handleSignup}
          >
            Signup
          </Button>

          <Typography style={{ marginTop: "15px", textAlign: "center", color: msg.includes("successful") ? "green" : "red" }}>
            {msg}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default Signup;