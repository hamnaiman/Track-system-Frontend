import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { toast } from "react-toastify";
import { getAdminDashboard } from "../../api/admin.api";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const AdminDashboard = () => {

  /* ================= STATE ================= */
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState([]);
  const [rawMonthlyData, setRawMonthlyData] = useState([]);
  const [monthlyApplications, setMonthlyApplications] = useState([]);
  const [caseDistribution, setCaseDistribution] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [reminders, setReminders] = useState(null);

  const pieColors = ["#3E4A8A", "#6FAE7B", "#94A3B8"];

  /* ================= FETCH ================= */
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboard();
      const { kpis, monthlyApplications, caseDistribution, reminders } = res.data;

      setKpis([
        { label: "Total Users", value: kpis.totalUsers },
        { label: "Trademark Applications", value: kpis.totalApplications },
        { label: "Opposition Cases", value: kpis.totalOppositions },
        { label: "Hearings Scheduled", value: kpis.hearingsScheduled }
      ]);

      setRawMonthlyData(monthlyApplications);
      setCaseDistribution(caseDistribution);
      setReminders(reminders);

      if (!selectedYear && monthlyApplications.length) {
        setSelectedYear(
          monthlyApplications[monthlyApplications.length - 1].name.split("-")[1]
        );
      }

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORMAT MONTH DATA ================= */
  useEffect(() => {
    if (!selectedYear) return;

    setMonthlyApplications(
      rawMonthlyData
        .filter(item => item.name.endsWith(selectedYear))
        .map(item => {
          const [month, year] = item.name.split("-");
          return {
            name: `${MONTHS[month - 1]} ${year}`,
            value: item.value
          };
        })
    );
  }, [rawMonthlyData, selectedYear]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Loading dashboard…</div>;
  }

  const availableYears = [
    ...new Set(rawMonthlyData.map(item => item.name.split("-")[1]))
  ];

  /* ================= TOAST ================= */
  const showReminderToast = (type) => {
    if (!reminders) return;

    const content =
      type === "today"
        ? {
            title: " Due Today",
            a: reminders.breakdown.applications.today,
            o: reminders.breakdown.oppositions.today,
            type: toast.info
          }
        : {
            title: " Overdue Cases",
            a: reminders.breakdown.applications.overdue,
            o: reminders.breakdown.oppositions.overdue,
            type: toast.error
          };

    content.type(
      <div>
        <p className="font-semibold">{content.title}</p>
        <p className="text-sm mt-1">Trademark Applications: {content.a}</p>
        <p className="text-sm">Opposition Matters: {content.o}</p>
      </div>
    );
  };

  return (
    <div className="space-y-8">

      {/* ===== COMPACT HEADER ===== */}
      <div className="bg-white p-4 rounded-xl border text-center">
        <h1 className="text-xl font-bold text-[#3E4A8A]">
          Trade Developers & Protectors
        </h1>
        <p className="text-xs text-gray-500">
          Administrative Dashboard
        </p>
      </div>

      {/* ===== CHARTS (TOP PRIORITY) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* BAR */}
        <div className="bg-white p-5 rounded-xl border">
          <div className="flex justify-between mb-3">
            <h3 className="font-semibold text-[#3E4A8A]">
              Monthly Applications
            </h3>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyApplications}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#3E4A8A" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-gray-500 mt-3">
            Trademark applications filed per month.
          </p>
        </div>

        {/* PIE */}
        <div className="bg-white p-5 rounded-xl border">
          <h3 className="font-semibold text-[#3E4A8A] mb-3">
            Case Distribution
          </h3>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={caseDistribution} dataKey="value" innerRadius={45} outerRadius={75}>
                  {caseDistribution.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-5 mt-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#3E4A8A] rounded-full" /> Applications
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#6FAE7B] rounded-full" /> Oppositions
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#94A3B8] rounded-full" /> Hearings
            </span>
          </div>
        </div>
      </div>

      {/* ===== KPI CARDS ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white p-4 rounded-xl border text-center">
            <p className="text-xs text-gray-500">{kpi.label}</p>
            <h2 className="text-2xl font-bold text-[#3E4A8A] mt-1">
              {kpi.value}
            </h2>
          </div>
        ))}
      </div>

      {/* ===== REMINDERS ===== */}
      {reminders && (
        <div className="bg-white p-4 rounded-xl border">
          <h3 className="text-sm font-semibold text-[#3E4A8A] mb-3">
            Case Reminders
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div
              onClick={() => showReminderToast("today")}
              className="p-3 bg-blue-50 rounded-lg cursor-pointer text-center"
            >
              <p className="text-xs text-gray-600">Due Today</p>
              <p className="text-xl font-bold text-[#3E4A8A]">{reminders.today}</p>
            </div>

            <div
              onClick={() => showReminderToast("overdue")}
              className="p-3 bg-red-50 rounded-lg cursor-pointer text-center"
            >
              <p className="text-xs text-gray-600">Overdue</p>
              <p className="text-xl font-bold text-red-600">{reminders.overdue}</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <div className="text-center text-xs text-gray-400 pt-4 border-t">
        © {new Date().getFullYear()} Trade Developers & Protectors
      </div>

    </div>
  );
};

export default AdminDashboard;
