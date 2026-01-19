// src/routes/AgentRoutes.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AgentRoutes = () => {
  const role = localStorage.getItem("role");

  if (role !== "agent") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AgentRoutes;
