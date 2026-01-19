import React, { useState, useEffect } from "react";
import api from "../../../api/api";

const BasicSearch = () => {
  const [filters, setFilters] = useState({
    trademark: "",
    applicationNo: "",
    status: "",
    startDate: "",
    endDate: "",
    reportType: "summary"
  });

  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  // ===== FETCH STATUS LIST =====
  useEffect(() => {
    fetchStatuses();
  }, []);

  const fetchStatuses = async () => {
    try {
      const res = await api.get("/file-statuses");
      setStatuses(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch statuses:", err);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await api.post("/reports/basic-search", filters);
      setResults(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Basic Search Report
        </h2>
        <p className="text-sm text-gray-500">
          Search trademark applications using multiple filters
        </p>
      </div>

      {/* ===== FILTER CARD ===== */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Field
            label="Trademark"
            name="trademark"
            value={filters.trademark}
            onChange={handleChange}
          />

          <Field
            label="Application No"
            name="applicationNo"
            value={filters.applicationNo}
            onChange={handleChange}
          />

          {/* ===== STATUS DROPDOWN ===== */}
          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-1 focus:ring-[#3E4A8A]"
            >
              <option value="">All</option>
              {statuses.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.description}
                </option>
              ))}
            </select>
          </div>

          <Field
            label="From Date"
            name="startDate"
            type="date"
            value={filters.startDate}
            onChange={handleChange}
          />

          <Field
            label="To Date"
            name="endDate"
            type="date"
            value={filters.endDate}
            onChange={handleChange}
          />

          <div>
            <label className="text-sm font-medium text-gray-700">Report Type</label>
            <select
              name="reportType"
              value={filters.reportType}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1 focus:ring-1 focus:ring-[#3E4A8A]"
            >
              <option value="summary">Summary</option>
              <option value="details">Details</option>
            </select>
          </div>

        </div>

        <div className="mt-5">
          <button
            onClick={handleSearch}
            className="bg-[#3E4A8A] text-white px-6 py-2 rounded hover:bg-[#2f3970] transition"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* ===== LOADING ===== */}
      {loading && <div className="text-gray-500 text-sm">Loading report data...</div>}

      {/* ===== ERROR ===== */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* ===== RESULTS TABLE ===== */}
      {!loading && results.length > 0 && (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b bg-gray-50 font-medium text-gray-700">
            Search Results ({results.length})
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border px-4 py-2 text-left">Application No</th>
                  <th className="border px-4 py-2 text-left">Trademark</th>
                  <th className="border px-4 py-2 text-left">Applicant</th>
                  <th className="border px-4 py-2 text-left">Filing Date</th>
                  <th className="border px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((app) => (
                  <tr key={app._id} className="hover:bg-blue-50 transition">
                    <td className="border px-4 py-2">{app.applicationNumber}</td>
                    <td className="border px-4 py-2">{app.trademark}</td>
                    <td className="border px-4 py-2">{app.client?.customerName || "-"}</td>
                    <td className="border px-4 py-2">{new Date(app.dateOfFiling).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{app.status?.description || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== EMPTY ===== */}
      {!loading && results.length === 0 && (
        <div className="text-gray-500 text-sm">No records found</div>
      )}

    </div>
  );
};

/* ===== REUSABLE INPUT ===== */
const Field = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded px-3 py-2 mt-1 focus:ring-1 focus:ring-[#3E4A8A]"
    />
  </div>
);

export default BasicSearch;
