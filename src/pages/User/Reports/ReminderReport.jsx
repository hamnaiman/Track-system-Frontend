import React, { useState } from "react";
import api from "../../../api/api";

const ReminderReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  // ===== GENERATE REPORT =====
  const generateReport = async () => {
    if (!fromDate || !toDate) {
      setError("Please select both From Date and To Date");
      return;
    }

    setLoading(true);
    setError("");
    setRecords([]);

    try {
      const res = await api.post("/reports/reminders", {
        fromDate,
        toDate,
        applicant: "all", // user side = own data
      });

      setRecords(res.data?.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to generate reminder report"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Reminder Report
        </h2>
        <p className="text-sm text-gray-500">
          View reminder-based trademark applications
        </p>
      </div>

      {/* ===== FILTER CARD ===== */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Field
            label="From Date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />

          <Field
            label="To Date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />

          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full bg-[#3E4A8A] text-white py-2 rounded hover:bg-[#2f3970] transition disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>

        </div>
      </div>

      {/* ===== ERROR ===== */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* ===== RESULTS TABLE ===== */}
      {!loading && records.length > 0 && (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">

          <div className="px-4 py-3 border-b bg-[#F4F6F8] font-medium text-[#3E4A8A]">
  Reminder Records ({records.length})
</div>


          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-[#F4F6F8] text-[#3E4A8A] hidden sm:table-header-group">
                <tr>
                  <th className="border px-4 py-2 text-left">Application No</th>
                  <th className="border px-4 py-2 text-left">File No</th>
                  <th className="border px-4 py-2 text-left">Trademark</th>
                  <th className="border px-4 py-2 text-left">Goods</th>
                  <th className="border px-4 py-2 text-left">Reminder Date</th>
                  <th className="border px-4 py-2 text-left">Remark</th>
                </tr>
              </thead>

              <tbody>
                {records.map((row, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50 transition flex flex-col sm:table-row mb-4 sm:mb-0"
                  >
                    <td className="border px-4 py-2">
                      <span className="font-medium sm:hidden">Application No:</span>{" "}
                      {row.applicationNumber}
                    </td>
                    <td className="border px-4 py-2">
                      <span className="font-medium sm:hidden">File No:</span>{" "}
                      {row.fileNumber || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      <span className="font-medium sm:hidden">Trademark:</span>{" "}
                      {row.trademark}
                    </td>
                    <td className="border px-4 py-2">
                      <span className="font-medium sm:hidden">Goods:</span>{" "}
                      {row.goods || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      <span className="font-medium sm:hidden">Reminder Date:</span>{" "}
                      {new Date(row.reminderDate).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      <span className="font-medium sm:hidden">Remark:</span>{" "}
                      {row.reminderRemark || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ===== EMPTY STATE ===== */}
      {!loading && records.length === 0 && !error && (
        <div className="text-gray-500 text-sm text-center py-8">
          No reminder records found for selected dates
        </div>
      )}

    </div>
  );
};

/* ===== REUSABLE FIELD ===== */
const Field = ({ label, type = "text", value, onChange }) => (
  <div>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border rounded px-3 py-2 mt-1 focus:ring-1 focus:ring-[#3E4A8A]"
    />
  </div>
);

export default ReminderReport;