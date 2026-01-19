// src/api/admin.api.js
import api from "./api";

export const getAdminDashboard = () => {
  return api.get("/admin/dashboard");
};
