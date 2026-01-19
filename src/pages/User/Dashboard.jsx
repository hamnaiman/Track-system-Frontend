import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();

  /* ================= USER INFO ================= */
  const userName =
    localStorage.getItem("userName") ||
    localStorage.getItem("name") ||
    "User";

  /* ================= STATE ================= */
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  /* ================= FETCH APPLICATIONS ================= */
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/applications");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setApplications(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATS ================= */
  const totalApps = applications.length;

  const publishedApps = applications.filter(
    (app) => app.status?.description === "Published"
  ).length;

  const pendingApps = totalApps - publishedApps;

  /* ================= GRAPH DATA ================= */
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
    <div className="space-y-10">

      {/* ================= WELCOME ================= */}
      <div className="bg-white rounded-xl border p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#3E4A8A]">
          Welcome, {userName}
        </h1>
        <p className="text-gray-500 mt-1">
          Manage and track your trademark applications efficiently
        </p>
      </div>

      {/* ================= GRAPH + SIDE CARDS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===== GRAPH ===== */}
        <div className="lg:col-span-2 bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold text-[#3E4A8A] mb-4">
            Applications Over Time
          </h3>

          {loading ? (
            <p className="text-gray-500">Loading data…</p>
          ) : graphData.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-gray-500 border rounded-lg">
              No application activity found
            </div>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData}>
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3E4A8A"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* ===== SIDE INFO CARDS ===== */}
        <div className="space-y-4">

          <div
            onClick={() => navigate("/user/trademark/applications")}
            className="bg-white rounded-xl border p-5 cursor-pointer hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500">Total Applications</p>
            <h2 className="text-2xl font-bold text-[#3E4A8A] mt-1">
              {loading ? "…" : totalApps}
            </h2>
          </div>

          <div className="bg-white rounded-xl border p-5">
            <p className="text-sm text-gray-500">Published</p>
            <h2 className="text-2xl font-bold text-[#6FAE7B] mt-1">
              {loading ? "…" : publishedApps}
            </h2>
          </div>

          <div className="bg-white rounded-xl border p-5">
            <p className="text-sm text-gray-500">Pending / In Process</p>
            <h2 className="text-2xl font-bold text-gray-700 mt-1">
              {loading ? "…" : pendingApps}
            </h2>
          </div>

        </div>
      </div>

      {/* ================= PROFESSIONAL FOOTER ================= */}
      <footer className="border-t pt-6 text-center text-sm text-gray-400">
        <p>
          © {new Date().getFullYear()} Trade Developers & Protectors
        </p>
        <p className="mt-1">
          Intellectual Property Management System — User Portal
        </p>
      </footer>

    </div>
  );
};

export default Dashboard;
