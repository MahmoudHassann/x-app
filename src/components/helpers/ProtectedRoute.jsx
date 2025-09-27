import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, redirectTo, isCanGo }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token is missing or undefined");
      return false;
    }

    const isValidToken = () => {
      if (token.split(".").length !== 3) {
        console.error("Invalid token: missing parts");
        return false;
      }

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp > currentTime;
      } catch {
        console.error("Invalid token");
        return false;
      }
    };

    return isValidToken();
  };

  if (!isAuthenticated() && !isCanGo) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default ProtectedRoute;
