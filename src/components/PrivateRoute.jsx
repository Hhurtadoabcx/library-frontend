import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Si no hay token, redirige a la página de login ("/")
    return <Navigate to="/" replace />;
  }

  // Si hay token, muestra el contenido protegido
  return children;
};

export default PrivateRoute;
