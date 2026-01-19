import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserRoutes = () => {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    console.log("UserRoutes auth check:", { token, role });

    const allowedRoles = ["user", "User", "customer", "CLIENT"];

    if (token && allowedRoles.includes(role)) {
      setAllowed(true);
    } else {
      setAllowed(false);
    }

    setChecking(false);
  }, []);

  // ⏳ Wait until auth check completes
  if (checking) {
    return null; // or loading spinner
  }

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default UserRoutes;
