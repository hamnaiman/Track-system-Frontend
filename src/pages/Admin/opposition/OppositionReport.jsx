import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const OppositionReport = () => {
  const [filters, setFilters] = useState({
    oppositionNumber: "",
    startDate: "",
    endDate: "",
    oppositionType: "",
    status: "",
    clientId: "",
    trademark: "",
    journalNo: ""
  });

  const [customers, setCustomers] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/customers")
      .then(res => setCustomers(res.data?.data || []))
      .catch(() => toast.error("Failed to load clients"));
  }, []);

  const handleChange = e =>
    setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await api.get("/reports/opposition/admin", { params: filters });
      setRecords(res.data?.data || []);
    } catch {
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] p-4 sm:p-6 bg-gray-50 flex justify-center">
      <div className="w-full max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl sm:text-2xl font-bold text-[#3E4A8A]">
            Opposition Report
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Search & view opposition records
          </p>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-xl shadow p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input className="input" placeholder="Opposition Number" name="oppositionNumber" onChange={handleChange} />
            <input type="date" className="input" name="startDate" onChange={handleChange} />
            <input type="date" className="input" name="endDate" onChange={handleChange} />
            <select className="input" name="oppositionType" onChange={handleChange}>
              <option value="">Opposition Type</option>
              <option value="Applicant">Applicant</option>
              <option value="Opponent">Opponent</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select className="input" name="status" onChange={handleChange}>
              <option value="">Status</option>
              <option value="Pending">Pending</option>
              <option value="Decided">Decided</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>

            <input className="input" placeholder="Trademark" name="trademark" onChange={handleChange} />
            <input className="input" placeholder="Journal No" name="journalNo" onChange={handleChange} />

            <select className="input" name="clientId" onChange={handleChange}>
              <option value="">Client</option>
              {customers.map(c => (
                <option key={c._id} value={c._id}>{c.customerName}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-[#3E4A8A] text-white px-8 py-2 rounded-lg hover:bg-[#2f3970]"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>

        {/* RESULTS */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="px-4 py-3 bg-[#3E4A8A] text-white font-semibold">
            Opposition Records ({records.length})
          </div>

          {/* ===== MOBILE CARDS ===== */}
          <div className="sm:hidden p-4 space-y-3">
            {records.length ? records.map(r => (
              <div key={r.srNo} className="border rounded-lg p-3 bg-gray-50 shadow-sm">
                <Row label="#"> {r.srNo}</Row>
                <Row label="Opposition No">{r.oppositionNumber}</Row>
                <Row label="Type">{r.oppositionType}</Row>
                <Row label="Status">{r.status}</Row>
                <Row label="Trademark">{r.trademark}</Row>
                <Row label="Journal No">{r.journalNo}</Row>
                <Row label="Client">{r.clientName}</Row>
                <Row label="Date">{new Date(r.oppositionDate).toLocaleDateString()}</Row>
              </div>
            )) : (
              <p className="text-center text-gray-500 py-6">
                No records found
              </p>
            )}
          </div>

          {/* ===== DESKTOP TABLE ===== */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-[900px] w-full text-sm">
              <thead className="bg-blue-50 text-[#3E4A8A]">
                <tr>
                  <Th>#</Th>
                  <Th>Opposition No</Th>
                  <Th>Type</Th>
                  <Th>Status</Th>
                  <Th>Trademark</Th>
                  <Th>Journal No</Th>
                  <Th>Client</Th>
                  <Th>Date</Th>
                </tr>
              </thead>
              <tbody>
                {records.length ? records.map(r => (
                  <tr key={r.srNo} className="border-t hover:bg-gray-50">
                    <Td>{r.srNo}</Td>
                    <Td>{r.oppositionNumber}</Td>
                    <Td>{r.oppositionType}</Td>
                    <Td>{r.status}</Td>
                    <Td>{r.trademark}</Td>
                    <Td>{r.journalNo}</Td>
                    <Td>{r.clientName}</Td>
                    <Td>{new Date(r.oppositionDate).toLocaleDateString()}</Td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-400">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default OppositionReport;

/* ===== HELPERS ===== */

const Row = ({ label, children }) => (
  <div className="flex justify-between gap-2 text-sm">
    <span className="font-medium text-gray-600">{label}</span>
    <span className="text-gray-800 text-right">{children}</span>
  </div>
);

const Th = ({ children }) => (
  <th className="px-4 py-3 text-left text-[13px] font-bold whitespace-nowrap">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="p-3 text-sm whitespace-nowrap">
    {children}
  </td>
);
