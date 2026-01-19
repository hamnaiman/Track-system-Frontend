import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AgentSidebar from "../components/AgentSidebar";

const AgentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <div
        className={`fixed lg:static z-50 h-full w-64  transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <AgentSidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* ===== MAIN AREA ===== */}
      <div className="flex-1 flex flex-col">

        {/* ===== HEADER ===== */}
        <header className="h-14 bg-white border-b flex items-center justify-between px-4 lg:px-6">

          {/* Mobile Menu */}
          <button
            className="lg:hidden text-gray-700 text-2xl"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          {/* ===== SYSTEM NAME ===== */}
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
                Agent Dashboard
              </p>
            </div>
          </div>

          <div />
        </header>

        {/* ===== PAGE CONTENT ===== */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AgentLayout;