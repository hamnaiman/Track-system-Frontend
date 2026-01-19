import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const AgentDashboard = () => {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    clients: 0,
    tmForms: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [appsRes, dashRes] = await Promise.all([
        api.get("/applications"),
        api.get("/agents/dashboard")
      ]);

      const apps = Array.isArray(appsRes.data)
        ? appsRes.data
        : appsRes.data?.data || [];

      setApplications(apps);

      const payload = dashRes.data?.data || {};
      setStats({
        clients: payload.clients || 0,
        tmForms: payload.tmForms || 0
      });
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const graphData = useMemo(() => {
    if (!applications.length) return [];

    const map = {};
    applications.forEach((app) => {
      if (!app.createdAt) return;
      const date = new Date(app.createdAt).toLocaleDateString();
      map[date] = (map[date] || 0) + 1;
    });

    return Object.keys(map)
      .map((date) => ({ date, count: map[date] }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [applications]);

  return (
    <div className="
      w-full
      max-w-[1600px]
      mx-auto
      px-3 sm:px-6 lg:px-8
      space-y-4 sm:space-y-6
    ">

      {/* HEADER */}
      <div>
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-[#3E4A8A]">
          Agent Dashboard
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-1">
          Overview of applications, TM forms and client activity
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          label="Applications"
          value={loading ? "…" : applications.length}
          onClick={() => navigate("/agent/applications")}
        />
        <StatCard
          label="Clients"
          value={loading ? "…" : stats.clients}
          onClick={() => navigate("/agent/clients")}
        />
        <StatCard
          label="TM Forms"
          value={loading ? "…" : stats.tmForms}
          onClick={() => navigate("/agent/tm-forms")}
        />
      </div>

      {/* GRAPH + ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">

        {/* GRAPH */}
        <div className="lg:col-span-2 bg-white rounded-xl p-3 sm:p-6 border">
          <h3 className="text-sm sm:text-lg font-semibold text-[#3E4A8A]">
            Applications Over Time
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-400 mb-3">
            Daily growth of trademark applications
          </p>

          <div className="h-48 sm:h-64 md:h-72 w-full overflow-hidden">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Loading graph…
              </div>
            ) : graphData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 border rounded-lg text-sm">
                No application data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3E4A8A"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-xl p-3 sm:p-6 border space-y-2 sm:space-y-3">
          <h3 className="text-sm sm:text-lg font-semibold text-[#3E4A8A]">
            Quick Actions
          </h3>

          {[
            { label: "Applications", path: "/agent/applications" },
            { label: "TM Forms", path: "/agent/tm-forms" },
            { label: "Clients", path: "/agent/clients" },
            { label: "Hearings", path: "/agent/hearings" },
             { label: "Documents", path: "/agent/documents" }
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="
                w-full
                text-left
                px-3 sm:px-4
                py-2 sm:py-2.5
                text-xs sm:text-base
                border
                rounded-lg
                hover:bg-[#F4F6F8]
                transition
              "
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AgentDashboard;

/* UI CARD */
const StatCard = ({ label, value, onClick }) => (
  <div
    onClick={onClick}
    className="
      bg-white
      rounded-xl
      p-3 sm:p-6
      border
      hover:shadow-md
      cursor-pointer
      transition
    "
  >
    <p className="text-[11px] sm:text-sm text-gray-500">{label}</p>
    <h2 className="text-xl sm:text-3xl font-bold text-[#3E4A8A] mt-1">
      {value}
    </h2>
  </div>
);