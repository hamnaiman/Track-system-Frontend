import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Role guard: only admins can access
  const role = localStorage.getItem("role");
  if (role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex bg-[#F4F6F8] overflow-hidden">

      {/* ===== MOBILE OVERLAY ===== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`fixed lg:static z-50 h-full w-64 bg-[#3E4A8A] transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <Sidebar role="admin" />
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="flex-1 flex flex-col">

        {/* ===== TOP HEADER ===== */}
        <header className="h-14 bg-white border-b flex items-center justify-between px-4 lg:px-6 shadow-sm">
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

         <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="TDP Logo"
              className="h-8 w-auto object-contain"
            />

            <div className="leading-tight">
              <h2 className="text-sm sm:text-base font-bold text-[#3E4A8A]">
                Trade Developers & Protectors
              </h2>
              <p className="text-xs text-gray-500 hidden sm:block">
             Admin Dashboard
              </p>
            </div>
          </div>

          {/* Right Placeholder (future profile/avatar) */}
          <div />
        </header>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F4F6F8]">
          {/* ✅ All nested routes (like UserManual) render here */}
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;