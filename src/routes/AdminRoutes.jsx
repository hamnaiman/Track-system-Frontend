import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default AdminRoutes;
