import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const linkBase =
  "relative block px-4 py-2 rounded text-sm transition-all duration-200";
const linkInactive =
  "text-gray-700 hover:bg-blue-50 hover:text-[#3E4A8A]";
const linkActive =
  "bg-blue-50 text-[#3E4A8A] font-semibold before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#3E4A8A]";

const Sidebar = ({ role, name }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    {/* ✅ FULL SIDEBAR SCROLL */}
    <aside className="w-64 bg-white border-r h-screen overflow-y-auto flex flex-col">

      {/* ===== BRAND ===== */}
      <div className="h-20 flex flex-col justify-center px-5 border-b">
        <h1 className="text-sm font-bold text-[#3E4A8A] uppercase tracking-wide">
          TRADE DEVELOPERS & PROTECTORS
        </h1>
        {name && (
          <p className="text-xs text-gray-500 mt-1 truncate">{name}</p>
        )}
      </div>

      {/* ===== ALL MENU (NO SCROLL HERE) ===== */}
      <div className="py-3 space-y-4 flex-1">

        {/* ================= ADMIN ================= */}
        {role === "admin" && (
          <>
            <Section title="Dashboard">
              <Item to="/admin/dashboard">Dashboard</Item>
            </Section>

            <Section title="Setups">
              <Item to="/admin/setups/add-user">Add User</Item>
              <Item to="/admin/setups/country">Country</Item>
              <Item to="/admin/setups/city">City</Item>
              <Item to="/admin/setups/class">Class</Item>
              <Item to="/admin/setups/business-type">Business Type</Item>
              <Item to="/admin/setups/file-status">File Status</Item>
              <Item to="/admin/setups/tm-forms">TM Forms</Item>
              <Item to="/admin/setups/agent-registration">Agent Registration</Item>
              <Item to="/admin/setups/agent-list-tm">Agent List TM</Item>
              <Item to="/admin/setups/customer-registration">
                Customer Registration
              </Item>
              <Item to="/admin/setups/customer-list-tm">
                Customer List TM
              </Item>
            </Section>

            <Section title="Trademark">
              <Item to="/admin/trademark/applications">Application Details</Item>
              <Item to="/admin/trademark/hearings">Hearings</Item>
              <Item to="/admin/trademark/journal-details">Journal Details</Item>
              <Item to="/admin/trademark/renewal-details">Renewal Details</Item>
              <Item to="/admin/trademark/tm-form-entries">TM Form Entries</Item>
              <Item to="/admin/trademark/documents">TM Documents</Item>
            </Section>

            <Section title="Trademark Journal">
              <Item to="/admin/journal/monthly">Monthly Journal</Item>
              <Item to="/admin/journal/compare">Compare Journal</Item>
              <Item to="/admin/journal/search-manual">
                Search Manual Journal
              </Item>
            </Section>

            <Section title="Opposition">
              <Item to="/admin/opposition/add">Add Opposition</Item>
              <Item to="/admin/opposition/documents">
                Opposition Documents
              </Item>
              <Item to="/admin/opposition/form-entries">
                Opposition Form Entries
              </Item>
              <Item to="/admin/opposition/report">Opposition Report</Item>
              <Item to="/admin/opposition/reminder-report">
                Opposition Reminder Report
              </Item>
              <Item to="/admin/opposition/single-query">
                Opposition Single Query
              </Item>
            </Section>

            <Section title="Reports">
              <Item to="/admin/reports/basic-search">Basic Search</Item>
              <Item to="/admin/reports/single-query">Single Query</Item>
            </Section>

            <Section title="Utility">
              <Item to="/admin/change-password">Change Password</Item>
              <Item to="/admin/date-setup">Date Setup</Item>
              <Item to="/admin/logo-setup">Logo Setup</Item>
              <Item to="/admin/user-manual">User Manual</Item>
            </Section>
          </>
        )}

        {/* ================= USER ================= */}
        {role === "user" && (
          <>
            <Section title="Trademark">
              <Item to="/user/dashboard">Dashboard</Item>
              <Item to="/user/trademark/applications">My Applications</Item>
              <Item to="/user/trademark/journal-details">Journal Details</Item>
              <Item to="/user/trademark/journal/monthly">Monthly Journal</Item>
              <Item to="/user/trademark/journal/compare">Compare Journal</Item>
              <Item to="/user/trademark/journal/search-manual">
                Search Manual Journal
              </Item>
              <Item to="/user/trademark/hearings">Hearings</Item>
              <Item to="/user/trademark/renewal-details">Renewals</Item>
              <Item to="/user/trademark/tm-forms">TM Forms</Item>
            </Section>

            <Section title="Utility">
              <Item to="/user/change-password">Change Password</Item>
            </Section>
          </>
        )}
      </div>

      {/* ===== LOGOUT (LAST, ALWAYS REACHABLE) ===== */}
      <div className="border-t p-3">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
        >
          Logout
        </button>
      </div>

    </aside>
  );
};

/* ===== HELPERS ===== */
const Section = ({ title, children }) => (
  <div>
    <div className="px-5 mb-2 text-xs font-semibold text-gray-400 uppercase">
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

export default Sidebar;
