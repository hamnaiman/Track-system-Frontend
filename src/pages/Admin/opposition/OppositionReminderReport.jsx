import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const OppositionReminderReport = () => {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    clientId: ""
  });

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  /* ===== LOAD APPLICANTS ===== */
  useEffect(() => {
    api
      .get("/customers")
      .then(res => {
        setClients(res.data?.data || []);
      })
      .catch(() => toast.error("Failed to load applicants"));
  }, []);

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  /* ===== GENERATE REPORT ===== */
  const generateReport = async () => {
    try {
      setLoading(true);

      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.clientId) params.clientId = filters.clientId;

      const res = await api.get("/opposition/reminders/report", { params });
      setResults(res.data?.data || []);
    } catch {
      toast.error("Failed to load reminder report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl sm:text-2xl font-bold text-[#3E4A8A]">
            Opposition Reminder Report
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Shows pending opposition work within selected reminder dates
          </p>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

            <Field label="Reminder Start Date">
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleChange}
                className="input"
              />
            </Field>

            <Field label="Reminder End Date">
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleChange}
                className="input"
              />
            </Field>

            <Field label="Applicant">
              <select
                name="clientId"
                value={filters.clientId}
                onChange={handleChange}
                className="input"
              >
                <option value="">All Applicants</option>
                {clients.map(c => (
                  <option key={c._id} value={c._id}>
                    {c.customerName} {/* ✅ FIX HERE */}
                  </option>
                ))}
              </select>
            </Field>

            <button
              onClick={generateReport}
              disabled={loading}
              className="bg-[#3E4A8A] text-white h-10 rounded-lg hover:bg-[#2f3970]"
            >
              {loading ? "Generating..." : "Generate"}
            </button>

          </div>
        </div>

        {/* RESULTS */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-4 py-3 bg-[#3E4A8A] text-white font-semibold">
            Reminder Results ({results.length})
          </div>

          {/* DESKTOP */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-50 text-[#3E4A8A]">
                <tr>
                  <Th>Opposition #</Th>
                  <Th>Applicant</Th>
                  <Th>Reminder Date</Th>
                  <Th>Task Description</Th>
                  <Th>Created On</Th>
                </tr>
              </thead>
              <tbody>
                {results.length ? results.map(row => (
                  <tr key={row._id} className="border-t hover:bg-gray-50">
                    <Td>{row.oppositionNumber}</Td>
                    <Td>{row.applicantName}</Td>
                    <Td>{new Date(row.reminderDate).toLocaleDateString()}</Td>
                    <Td>{row.taskDescription}</Td>
                    <Td>{new Date(row.createdAt).toLocaleDateString()}</Td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No pending reminders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OppositionReminderReport;

/* ===== HELPERS ===== */

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    {children}
  </div>
);

const Th = ({ children }) => (
  <th className="p-3 text-left font-bold">{children}</th>
);

const Td = ({ children }) => (
  <td className="p-3">{children}</td>
);
