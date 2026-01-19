import React, { useState } from "react";
import api from "../../../api/api";

const CompareJournal = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [journalNumber, setJournalNumber] = useState("");
  const [searchType, setSearchType] = useState("equal");
  const [charCount, setCharCount] = useState(3);
  const [compareClass, setCompareClass] = useState(false);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const res = await api.post("/journal-compare", {
        journalNumber: journalNumber || undefined,
        searchType,
        charCount,
        clientId: "all",
        compareClass,
      });

      setResults(res.data?.results || []);
    } catch (err) {
      console.error("Comparison failed", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Compare Trademark with Journal
        </h2>
        <p className="text-sm text-gray-500">
          Match your trademarks against published journal records
        </p>
      </div>

      {/* ===== FILTER PANEL ===== */}
      <div className="bg-white border rounded-lg shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Journal Number (optional)
            </label>
            <input
              type="text"
              value={journalNumber}
              onChange={(e) => setJournalNumber(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
              placeholder="e.g. 2150"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Match Type
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
            >
              <option value="equal">Exact Match</option>
              <option value="prefix">Prefix Match</option>
              <option value="suffix">Suffix Match</option>
              <option value="contains">Contains</option>
            </select>
          </div>

          {(searchType === "prefix" || searchType === "suffix") && (
            <div>
              <label className="text-sm font-medium text-gray-700">
                Character Count
              </label>
              <input
                type="number"
                min="1"
                value={charCount}
                onChange={(e) => setCharCount(Number(e.target.value))}
                className="mt-1 w-full border rounded px-3 py-2 text-sm"
              />
            </div>
          )}

          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <input
              type="checkbox"
              checked={compareClass}
              onChange={(e) => setCompareClass(e.target.checked)}
            />
            <span className="text-sm text-gray-700">
              Match Class
            </span>
          </div>

          <button
            onClick={handleCompare}
            disabled={loading}
            className="bg-[#3E4A8A] text-white px-5 py-2 rounded hover:bg-[#2f3a72] transition text-sm"
          >
            {loading ? "Comparing..." : "Compare"}
          </button>

        </div>
      </div>

      {/* ===== RESULTS ===== */}
      {loading ? (
        <div className="py-8 text-center text-gray-500">Comparing trademarks...</div>
      ) : results.length === 0 ? (
        <div className="py-8 text-center text-gray-500">No matching records found</div>
      ) : (
        <>
          {/* ===== MOBILE CARDS ===== */}
          <div className="space-y-3 sm:hidden">
            {results.map((row, idx) => (
              <div key={idx} className="bg-white border rounded-lg shadow-sm p-4 space-y-2">
                <div className="text-sm font-medium text-[#3E4A8A]">
                  {row.customerTrademark || "-"}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Customer Class:</span> {row.customerClass?.join(", ") || "-"}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Journal Trademark:</span> {row.journalTrademark || "-"}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Journal Class:</span> {row.journalClass || "-"}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Journal No:</span> {row.journalNumber || "-"}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Application No:</span> {row.applicationNo || "-"}
                </div>
              </div>
            ))}
          </div>

        
          {/* ===== DESKTOP TABLE ===== */}
<div className="hidden sm:block bg-white border rounded-lg shadow-sm overflow-x-auto">
  <table className="min-w-full text-sm border-collapse">
    <thead className="bg-blue-50 text-[#3E4A8A]">
      <tr>
        <th className="border px-4 py-3 text-left font-semibold">
          Customer Trademark
        </th>
        <th className="border px-4 py-3 text-left font-semibold">
          Customer Class
        </th>
        <th className="border px-4 py-3 text-left font-semibold">
          Journal Trademark
        </th>
        <th className="border px-4 py-3 text-left font-semibold">
          Journal Class
        </th>
        <th className="border px-4 py-3 text-left font-semibold">
          Journal No
        </th>
        <th className="border px-4 py-3 text-left font-semibold">
          Application No
        </th>
      </tr>
    </thead>

    <tbody>
      {results.map((row, idx) => (
        <tr key={idx} className="hover:bg-blue-50 transition">
          <td className="border px-4 py-2 font-medium">
            {row.customerTrademark || "-"}
          </td>
          <td className="border px-4 py-2">
            {row.customerClass?.join(", ") || "-"}
          </td>
          <td className="border px-4 py-2">
            {row.journalTrademark || "-"}
          </td>
          <td className="border px-4 py-2">
            {row.journalClass || "-"}
          </td>
          <td className="border px-4 py-2">
            {row.journalNumber || "-"}
          </td>
          <td className="border px-4 py-2">
            {row.applicationNo || "-"}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        </>
      )}
    </div>
  );
};

export default CompareJournal;
