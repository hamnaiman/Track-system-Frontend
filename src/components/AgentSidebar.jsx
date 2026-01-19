import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/* ================= STYLES ================= */
const linkBase =
  "relative flex items-center px-4 py-2.5 rounded-md text-sm transition-all duration-200";
const linkInactive =
  "text-gray-700 hover:bg-[#F4F6F8] hover:text-[#3E4A8A]";
const linkActive =
  "bg-[#EEF1FA] text-[#3E4A8A] font-semibold " +
  "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#3E4A8A]";

/* ================= COMPONENT ================= */
const AgentSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r h-screen flex flex-col">

      {/* ===== BRAND (TOP SPACE FIXED) ===== */}
      <div className="h-20 flex items-center px-5 pt-2 border-b shrink-0">
        <h1 className="text-sm font-bold text-[#3E4A8A] uppercase tracking-wide">
          Trade Developers & Protectors
        </h1>
      </div>

      {/* ===== MENU (SCROLL AREA) ===== */}
      <div className="flex-1 overflow-y-auto min-h-0 py-3 space-y-4">

        <Section title="Trademark">
          <Item to="/agent/dashboard">Dashboard</Item>
          <Item to="/agent/applications">Applications</Item>
          <Item to="/agent/hearings">Hearings</Item>
          <Item to="/agent/documents">Documents</Item>
          <Item to="/agent/journal">Journal</Item>
          <Item to="/agent/renewals">Renewals</Item>
          <Item to="/agent/tm-forms">TM Forms</Item>
        </Section>

        <Section title="Clients">
          <Item to="/agent/clients">Assigned Clients</Item>
        </Section>

        <Section title="Reports">
          <Item to="/agent/reports/reminder">Reminder Report</Item>
          <Item to="/agent/reports/renewal">Renewal Report</Item>
          <Item to="/agent/reports/single-query">Single Query</Item>
        </Section>

      </div>

      {/* ===== LOGOUT (STICKY BOTTOM) ===== */}
      <div className="border-t p-3 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm
                     text-red-600 hover:bg-red-50 rounded-md transition"
        >
          Logout
        </button>
      </div>

    </aside>
  );
};

/* ================= REUSABLE ================= */
const Section = ({ title, children }) => (
  <div>
    <div className="px-5 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
      {title}
    </div>
    <nav className="space-y-1 px-2">{children}</nav>
  </div>
);

const Item = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `${linkBase} ${isActive ? linkActive : linkInactive}`
    }
  >
    {children}
  </NavLink>
);

export default AgentSidebar;
