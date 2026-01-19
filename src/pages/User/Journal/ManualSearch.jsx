import React, { useState } from "react";
import api from "../../../api/api";

const ManualSearch = () => {
  const [journalNumber, setJournalNumber] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const [text, setText] = useState("");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await api.post("/monthly-journals/search", {
        journalNumber,
        applicationNumber,
        text,
      });
      setResults(res.data?.data || []);
    } catch (error) {
      console.error("Manual journal search failed", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESET ================= */
  const handleReset = () => {
    setJournalNumber("");
    setApplicationNumber("");
    setText("");
    setResults([]);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ===== PAGE HEADER ===== */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#3E4A8A]">
          Manual Journal Search
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Search trademarks manually from monthly journal records
        </p>
      </div>

      {/* ===== SEARCH CARD ===== */}
      <div className="bg-white border rounded-lg shadow-sm p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">

          <div>
            <label className="text-sm font-medium text-gray-700">
              Journal Number
            </label>
            <input
              type="text"
              value={journalNumber}
              onChange={(e) => setJournalNumber(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Application Number
            </label>
            <input
              type="text"
              value={applicationNumber}
              onChange={(e) => setApplicationNumber(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Trademark Text
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#3E4A8A] text-white px-5 py-2 rounded text-sm hover:bg-[#2f3a72] transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>

          <button
            onClick={handleReset}
            className="border border-gray-300 px-5 py-2 rounded text-sm hover:bg-gray-100 transition"
          >
            Reset
          </button>

        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
<div className="hidden sm:block bg-white border rounded-lg shadow-sm overflow-x-auto">
  <table className="min-w-full text-sm border-collapse">
    <thead className="bg-blue-50 text-[#3E4A8A]">
      <tr>
        <th className="border px-4 py-3 text-left font-semibold">
          Journal Date
        </th>
        <th className="border px-4 py-3 text-left font-semibold">
          Journal No
        </th>
        <th className="border px-4 py-3 text-left font-semibold">
          Application No
        </th>
        <th className="border px-4 py-3 text-left font-semibold">
          Trademark
        </th>
        <th className="border px-4 py-3 text-left font-semibold">
          Class
        </th>
      </tr>
    </thead>

    <tbody>
      {loading ? (
        <tr>
          <td colSpan="5" className="text-center py-8 text-gray-500">
            Searching journal records...
          </td>
        </tr>
      ) : results.length === 0 ? (
        <tr>
          <td colSpan="5" className="text-center py-8 text-gray-500">
            No records found
          </td>
        </tr>
      ) : (
        results.map((item) => (
          <tr key={item._id} className="hover:bg-blue-50 transition">
            <td className="border px-4 py-2">
              {item.journalDate
                ? new Date(item.journalDate).toLocaleDateString()
                : "-"}
            </td>
            <td className="border px-4 py-2">
              {item.journalNumber}
            </td>
            <td className="border px-4 py-2">
              {item.applicationNumber}
            </td>
            <td className="border px-4 py-2 font-medium">
              {item.trademark}
            </td>
            <td className="border px-4 py-2">
              {item.class}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="sm:hidden space-y-4">
        {loading && (
          <p className="text-center text-gray-500 text-sm">
            Searching journal records...
          </p>
        )}

        {!loading && results.length === 0 && (
          <p className="text-center text-gray-500 text-sm">
            No records found
          </p>
        )}

        {!loading &&
          results.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-lg shadow-sm p-4 space-y-2"
            >
              <Row label="Journal Date" value={
                item.journalDate
                  ? new Date(item.journalDate).toLocaleDateString()
                  : "-"
              } />
              <Row label="Journal No" value={item.journalNumber} />
              <Row label="Application No" value={item.applicationNumber} />

              <div className="text-sm">
                <span className="font-medium text-gray-600">
                  Trademark:
                </span>
                <p className="font-semibold text-gray-800 mt-1">
                  {item.trademark}
                </p>
              </div>

              <Row label="Class" value={item.class} />
            </div>
          ))}
      </div>

    </div>
  );
};

/* ===== SMALL HELPER ===== */
const Row = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="font-medium text-gray-600">{label}</span>
    <span>{value}</span>
  </div>
);

export default ManualSearch;
