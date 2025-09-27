import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); // check user token

  if (!token) {
    // if token not pass then redirect to login page.
    return <Navigate to="/login" replace />;
  }

  return children; // if token avliable then element render.
}

export default ProtectedRoute;