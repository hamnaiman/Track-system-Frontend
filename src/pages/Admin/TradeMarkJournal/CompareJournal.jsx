import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const CompareJournal = () => {
  const [journalNo, setJournalNo] = useState("");
  const [charCount, setCharCount] = useState("");
  const [searchType, setSearchType] = useState("equal");
  const [clientId, setClientId] = useState("all");
  const [compareClass, setCompareClass] = useState(false);
  const [clients, setClients] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD CLIENTS ================= */
  useEffect(() => {
    api
      .get("/customers")
      .then((res) => setClients(res.data?.data || []))
      .catch(() => toast.error("Failed to load clients"));
  }, []);

  /* ================= GENERATE REPORT ================= */
  const generateReport = async () => {
    if (
      (searchType === "prefix" || searchType === "suffix") &&
      (!charCount || Number(charCount) <= 0)
    ) {
      toast.warning("Please select number of characters");
      return;
    }

    try {
      setLoading(true);

      const payload = { searchType, compareClass };
      if (journalNo.trim()) payload.journalNumber = journalNo.trim();
      if (clientId !== "all") payload.clientId = clientId;
      if (searchType === "prefix" || searchType === "suffix")
        payload.charCount = Number(charCount);

      const res = await api.post("/journal-compare", payload);
      setResults(res.data?.results || []);
      toast.success(`Matches found: ${res.data?.results?.length || 0}`);
    } catch (err) {
      console.error("COMPARE ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">

      {/* ================= HEADING CARD ================= */}
      <div className="bg-white rounded-2xl shadow border p-4 sm:p-6 md:p-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#3E4A8A]">
          Compare Trademark with Journal
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-1">
          Match all journal published trademarks with your customer’s trademark.
        </p>
      </div>

      {/* ================= FILTER CARD ================= */}
      <div className="bg-white rounded-2xl shadow border p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          <Field label="Journal Number (Optional)">
            <input
              value={journalNo}
              onChange={(e) => setJournalNo(e.target.value)}
              placeholder="Journal Number"
              className="input w-full"
            />
          </Field>

          <Field label="Search Type">
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setCharCount("");
              }}
              className="input w-full"
            >
              <option value="equal">Equal</option>
              <option value="prefix">Prefix</option>
              <option value="suffix">Suffix</option>
              <option value="contains">Contains</option>
            </select>
          </Field>

          {(searchType === "prefix" || searchType === "suffix") && (
            <Field label="No. of Characters">
              <select
                value={charCount}
                onChange={(e) => setCharCount(e.target.value)}
                className="input w-full"
              >
                <option value="">Select Characters</option>
                {[3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} Characters
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Client">
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="input w-full"
            >
              <option value="all">All Clients</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.customerName}
                </option>
              ))}
            </select>
          </Field>

          {/* CHECKBOX */}
          <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
            <input
              type="checkbox"
              checked={compareClass}
              onChange={(e) => setCompareClass(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">
              Match Exact Class
            </span>
          </div>

          {/* BUTTON */}
          <div className="sm:col-span-2 lg:col-span-3 mt-2 sm:mt-4">
            <button
              disabled={loading}
              onClick={generateReport}
              className="w-full bg-[#3E4A8A] hover:bg-[#2f3970]
                         disabled:opacity-60 text-white
                         py-2.5 sm:py-3 rounded-lg font-semibold"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= RESULTS ================= */}
      {results.length > 0 && (
        <div className="bg-white rounded-2xl shadow border p-4 sm:p-6 overflow-x-auto">
          <h3 className="text-base sm:text-lg font-semibold mb-4">
            Matched Results ({results.length})
          </h3>

          {/* Mobile: stacked cards */}
          <div className="md:hidden space-y-4">
            {results.map((r, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 shadow-sm">
                <div className="text-sm space-y-1">
                  <div><span className="font-semibold">Customer Trademark:</span> {r.customerTrademark}</div>
                  <div><span className="font-semibold">Customer Class(es):</span> {(r.customerClass || []).join(", ")}</div>
                  <div><span className="font-semibold">Journal Trademark:</span> {r.journalTrademark}</div>
                  <div><span className="font-semibold">Journal Class:</span> {r.journalClass}</div>
                  <div><span className="font-semibold">Journal #:</span> {r.journalNumber}</div>
                  <div><span className="font-semibold">Application #:</span> {r.applicationNo}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/Tablet: table */}
          <div className="hidden md:block">
            <table className="min-w-full w-full text-xs sm:text-sm border-collapse table-auto">
              <thead className="bg-blue-50 text-[#3E4A8A]">
                <tr>
                  <Th>Customer Trademark</Th>
                  <Th>Customer Class(es)</Th>
                  <Th>Journal Trademark</Th>
                  <Th>Journal Class</Th>
                  <Th>Journal #</Th>
                  <Th>Application #</Th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <Td>{r.customerTrademark}</Td>
                    <Td>{(r.customerClass || []).join(", ")}</Td>
                    <Td>{r.journalTrademark}</Td>
                    <Td>{r.journalClass}</Td>
                    <Td>{r.journalNumber}</Td>
                    <Td>{r.applicationNo}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareJournal;

/* ================= UI HELPERS ================= */
const Field = ({ label, children }) => (
  <div>
    <label className="text-sm sm:text-base font-semibold text-gray-600 mb-1 block">{label}</label>
    {children}
  </div>
);

const Th = ({ children }) => (
  <th className="border px-2 sm:px-3 py-2 text-left font-bold whitespace-nowrap">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="border px-2 sm:px-3 py-2 text-gray-800 break-words">{children}</td>
);