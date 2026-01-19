import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

/* ===== THEME (SAME AS ADMIN) ===== */
const linkBase =
  "relative block px-4 py-2 rounded text-sm transition-all";
const linkInactive =
  "text-gray-700 hover:bg-blue-50 hover:text-[#3E4A8A]";
const linkActive =
  "bg-blue-50 text-[#3E4A8A] font-semibold " +
  "before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#3E4A8A]";

const UserSidebar = ({ closeSidebar }) => {
  const [manualUrl, setManualUrl] = useState(null);
  const navigate = useNavigate();

  // Fetch latest manual on component mount
  useEffect(() => {
    const fetchManual = async () => {
      try {
        const res = await api.get("/user-manuals/user/user-manual", {
          responseType: "blob", // important for PDF download
        });

        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        setManualUrl(url);
      } catch (err) {
        console.error("Error fetching user manual:", err);
        toast.error("User manual not available");
      }
    };

    fetchManual();

    // Cleanup object URL on unmount
    return () => {
      if (manualUrl) window.URL.revokeObjectURL(manualUrl);
    };
  }, []);

  const handleDownloadManual = () => {
    if (!manualUrl) {
      toast.error("User manual not available");
      return;
    }

    const a = document.createElement("a");
    a.href = manualUrl;
    a.download = "User_Manual.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-white border-r h-full flex flex-col">

      {/* ===== HEADER ===== */}
      <div className="h-14 flex items-center px-4 font-semibold text-[#3E4A8A] border-b">
        TDP – User Panel
      </div>

      {/* ===== SCROLL AREA ===== */}
      <div className="flex-1 overflow-y-auto py-2">

        {/* ===== TRADEMARK ===== */}
        <Section title="Trademark">
          <Item to="/user/dashboard" onClick={closeSidebar}>Dashboard</Item>
          <Item to="/user/trademark/applications" onClick={closeSidebar}>My Applications</Item>
          <Item to="/user/trademark/journal-details" onClick={closeSidebar}>Journal Details</Item>
          <Item to="/user/journal/compare" onClick={closeSidebar}>Compare with Journal</Item>
          <Item to="/user/journal/search-manual" onClick={closeSidebar}>Manual Journal Search</Item>
          <Item to="/user/trademark/hearings" onClick={closeSidebar}>Hearings</Item>
          <Item to="/user/trademark/renewal-details" onClick={closeSidebar}>Renewal Details</Item>
          <Item to="/user/trademark/tm-forms" onClick={closeSidebar}>TM Forms</Item>
          <Item to="/user/trademark/documents" onClick={closeSidebar}>TM Documents</Item>
        </Section>

        {/* ===== OPPOSITION ===== */}
        <Section title="Opposition">
          <Item to="/user/opposition/documents" onClick={closeSidebar}>Opposition Documents</Item>
          <Item to="/user/opposition/forms" onClick={closeSidebar}>Opposition Forms</Item>
          <Item to="/user/opposition/reports" onClick={closeSidebar}>Opposition Reports</Item>
        </Section>

        {/* ===== REPORTS ===== */}
        <Section title="Reports">
          <Item to="/user/reports/basic-search" onClick={closeSidebar}>Basic Search</Item>
          <Item to="/user/reports/renewal" onClick={closeSidebar}>Renewal Report</Item>
          <Item to="/user/reports/reminder" onClick={closeSidebar}>Reminder Report</Item>
          <Item to="/user/reports/single-query" onClick={closeSidebar}>Single Query</Item>
        </Section>

        {/* ===== UTILITY ===== */}
        <Section title="Utility">
          <Item to="/user/change-password" onClick={closeSidebar}>Change Password</Item>
        </Section>

      </div>

      {/* ===== FOOTER ===== */}
      <div className="border-t p-3 flex flex-col gap-2 shrink-0">
        <button
          onClick={handleDownloadManual}
          className="w-full bg-[#3E4A8A] text-white text-sm py-2 rounded hover:bg-[#2f3970] transition"
        >
          Download User Manual
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm
                     text-red-600 hover:bg-red-50 rounded-md transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

/* ===== REUSABLE COMPONENTS ===== */
const Section = ({ title, children }) => (
  <>
    <div className="mt-5 px-4 text-xs font-semibold text-gray-500 uppercase">{title}</div>
    <nav className="mt-1 space-y-1 px-2">{children}</nav>
  </>
);

const Item = ({ to, onClick, children }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
  >
    {children}
  </NavLink>
);

export default UserSidebar;
