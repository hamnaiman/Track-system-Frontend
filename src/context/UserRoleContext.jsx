// src/context/UserRoleContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  const saveRole = (newRole) => {
    localStorage.setItem("role", newRole);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    setRole(null);
  };

  return (
    <UserRoleContext.Provider value={{ role, saveRole, logout }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => useContext(UserRoleContext);
