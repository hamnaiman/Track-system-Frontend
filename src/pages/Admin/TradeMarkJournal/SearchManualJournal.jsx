import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const SearchManualJournal = () => {
  const [journalNo, setJournalNo] = useState("");
  const [textToSearch, setTextToSearch] = useState("");
  const [applicationNo, setApplicationNo] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!journalNo && !textToSearch && !applicationNo) {
      toast.warning("Enter at least one search criteria");
      return;
    }

    try {
      const res = await api.post("/monthly-journals/search", {
        journalNumber: journalNo,
        text: textToSearch,
        applicationNumber: applicationNo,
      });
      setResults(res.data.data || []);
      toast.success("Search completed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed");
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-3 sm:px-6 space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#3E4A8A]">
          Search Manual TM in Journal
        </h2>
        <p className="text-sm text-gray-500">
          Enter search criteria to find journal entries
        </p>
      </div>

      {/* SEARCH FORM */}
      <div className="bg-white rounded-xl shadow border p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <Field label="Journal #" value={journalNo} onChange={e => setJournalNo(e.target.value)} />
          <Field label="Text to Search" value={textToSearch} onChange={e => setTextToSearch(e.target.value)} />

          <div className="sm:col-span-2">
            <Field label="Application #" value={applicationNo} onChange={e => setApplicationNo(e.target.value)} />
          </div>

          <button
            onClick={handleSearch}
            className="sm:col-span-2 bg-[#3E4A8A] hover:bg-[#2f3970] text-white py-2.5 rounded-lg font-semibold"
          >
            Generate
          </button>
        </div>
      </div>

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="bg-white border rounded-xl shadow overflow-hidden">

          {/* HEADER */}
          <div className="px-4 py-3 bg-[#3E4A8A] text-white font-semibold">
            Results Found ({results.length})
          </div>

          {/* ===== MOBILE CARDS ===== */}
          <div className="sm:hidden p-3 space-y-3">
            {results.map((r, i) => (
              <div key={i} className="border rounded-lg p-3 shadow-sm bg-gray-50">
                <Row label="Journal #">{r.journalNumber}</Row>
                <Row label="Application #">{r.applicationNumber}</Row>
                <Row label="Trademark">{r.trademark}</Row>
                <Row label="Class">{r.class}</Row>
                <Row label="Journal Date">{new Date(r.journalDate).toLocaleDateString()}</Row>
              </div>
            ))}
          </div>

          {/* ===== DESKTOP TABLE ===== */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-blue-50 text-[#3E4A8A]">
                <tr>
                  <Th>Journal #</Th>
                  <Th>Application #</Th>
                  <Th>Trademark</Th>
                  <Th>Class</Th>
                  <Th>Journal Date</Th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <Td>{r.journalNumber}</Td>
                    <Td>{r.applicationNumber}</Td>
                    <Td className="max-w-[300px] truncate">{r.trademark}</Td>
                    <Td>{r.class}</Td>
                    <Td>{new Date(r.journalDate).toLocaleDateString()}</Td>
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

export default SearchManualJournal;

/* ===== HELPERS ===== */
const Field = ({ label, ...props }) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
    <input {...props} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3E4A8A]" />
  </div>
);

const Row = ({ label, children }) => (
  <div className="flex justify-between text-sm">
    <span className="font-medium text-gray-600">{label}</span>
    <span className="text-gray-800 text-right">{children}</span>
  </div>
);

const Th = ({ children }) => (
  <th className="border px-4 py-2 text-left font-bold whitespace-nowrap">{children}</th>
);

const Td = ({ children, className = "" }) => (
  <td className={`border px-4 py-2 text-gray-800 break-words ${className}`}>{children}</td>
);