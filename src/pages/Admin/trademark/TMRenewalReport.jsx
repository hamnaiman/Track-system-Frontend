import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const TMRenewalReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [applicant, setApplicant] = useState("");

  const [customers, setCustomers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD CLIENTS ================= */
  useEffect(() => {
    api
      .get("/customers")
      .then((res) => setCustomers(res.data.data || []))
      .catch(() => toast.error("Failed to load clients"));
  }, []);

  /* ================= GENERATE RENEWAL REPORT ================= */
  const generateReport = async () => {
    if (!fromDate || !toDate) {
      toast.warning("Select both Renewal Due From & Renewal Due To");
      return;
    }

    setLoading(true);
    try {
      // ✅ Updated API route
      const res = await api.post("/renewal/report", {
        fromDate,
        toDate,
        applicant,
      });

      setResults(res.data.data || []);
      toast.success(`Renewal report generated (${res.data.count || 0})`);
    } catch (err) {
      console.error("TMRenewalReport Error:", err);
      toast.error(err.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          TM Renewal Report
        </h2>
        <p className="text-sm text-gray-500">
          View trademark renewal details by date and client
        </p>
      </div>

      {/* ================= FILTER CARD ================= */}
      <div className="bg-white rounded-2xl shadow border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Renewal Due From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 border
                         focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Renewal Due To
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 border
                         focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-600">
              Applicant
            </label>
            <select
              value={applicant}
              onChange={(e) => setApplicant(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 border
                         focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">All Clients</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.customerName}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 text-right mt-2">
            <button
              onClick={generateReport}
              disabled={loading}
              className="bg-[#3E4A8A] hover:bg-[#2f3970]
                         text-white px-8 py-3 rounded-lg font-semibold
                         disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= RESULTS TABLE ================= */}
      <div className="bg-white rounded-2xl shadow border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <Th>#</Th>
              <Th>Application #</Th>
              <Th>Trademark</Th>
              <Th>Client</Th>
              <Th>Renewed Upto</Th>
              <Th>Remark</Th>
            </tr>
          </thead>

          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No renewal records found
                </td>
              </tr>
            ) : (
              results.map((r, i) =>
                r.entries.map((en, idx) => (
                  <tr key={en._id} className="hover:bg-gray-50">
                    <Td>{i + 1}.{idx + 1}</Td>
                    <Td>{r.application?.applicationNumber}</Td>
                    <Td>{r.application?.trademark}</Td>
                    <Td>{r.application?.client?.customerName}</Td>
                    <Td>{new Date(en.renewedUpto).toLocaleDateString()}</Td>
                    <Td>{en.remark}</Td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TMRenewalReport;

/* ================= UI HELPERS ================= */
const Th = ({ children }) => (
  <th className="p-3 border text-left font-semibold text-gray-700">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="p-3 border text-gray-700">
    {children}
  </td>
);
