import React, { useState } from "react";
import API from "../api";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider
} from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Normal login
  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setMsg("Login successful!");
      navigate("/predict"); // 🚀 Redirect after login success
    } catch (err) {
      setMsg("Invalid credentials");
    }
  };

  // Google login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const tokenId = credentialResponse.credential;
      const res = await API.post("/google-login", { tokenId });
      localStorage.setItem("token", res.data.token);
      setMsg("Google Login successful!");
      navigate("/predict"); // 🚀 Redirect after Google login
    } catch (err) {
      setMsg("Google login failed");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <Card style={{ maxWidth: 400, width: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
        <CardContent>
          <Typography variant="h5" style={{ textAlign: "center", marginBottom: "20px", fontWeight: "bold" }}>
            🔑 Login
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
            onClick={handleLogin}
          >
            Login
          </Button>

          <Typography style={{ marginTop: "15px", textAlign: "center", color: msg.includes("successful") ? "green" : "red" }}>
            {msg}
          </Typography>

          <Divider style={{ margin: "20px 0" }}>Or</Divider>

          <Typography variant="subtitle1" style={{ textAlign: "center", marginBottom: "10px" }}>
            Login with Google
          </Typography>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setMsg("Google Login Error")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;