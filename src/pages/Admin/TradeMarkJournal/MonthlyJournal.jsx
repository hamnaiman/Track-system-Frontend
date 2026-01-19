import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const MonthlyJournal = () => {
  const [journalDate, setJournalDate] = useState("");
  const [journalNumber, setJournalNumber] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const [trademark, setTrademark] = useState("");
  const [classNo, setClassNo] = useState("");
  const [entries, setEntries] = useState([]);
  const [searchText, setSearchText] = useState("");

  const loadEntries = async () => {
    try {
      const res = await api.get("/monthly-journals");
      setEntries(res.data.data || []);
    } catch {
      toast.error("Failed to load journal entries");
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!journalDate || !journalNumber || !applicationNumber || !trademark || !classNo) {
      toast.warning("Please fill all fields");
      return;
    }
    try {
      await api.post("/monthly-journals", {
        journalDate,
        journalNumber,
        applicationNumber,
        trademark,
        class: classNo,
      });
      toast.success("Entry Added Successfully");
      setJournalDate("");
      setJournalNumber("");
      setApplicationNumber("");
      setTrademark("");
      setClassNo("");
      loadEntries();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add entry");
    }
  };

  const deleteEntry = async (id) => {
    try {
      await api.delete(`/monthly-journals/${id}`);
      toast.success("Entry deleted");
      loadEntries();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSearch = async () => {
    try {
      const res = await api.post("/monthly-journals/search", {
        journalNumber,
        applicationNumber,
        text: searchText,
      });
      setEntries(res.data.data || []);
    } catch {
      toast.error("Search failed");
    }
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#3E4A8A]">
          Monthly Journal Entries
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Add, search and manage monthly trademark journals
        </p>
      </div>

      {/* ADD FORM */}
      <div className="bg-white rounded-xl shadow border p-4 sm:p-6">
        <h3 className="font-semibold text-gray-700 mb-3">Add Journal Entry</h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3"
        >
          <Input type="date" value={journalDate} onChange={(e) => setJournalDate(e.target.value)} />
          <Input placeholder="Journal Number" value={journalNumber} onChange={(e) => setJournalNumber(e.target.value)} />
          <Input placeholder="Application Number" value={applicationNumber} onChange={(e) => setApplicationNumber(e.target.value)} />
          <Input
            placeholder="Trademark"
            className="md:col-span-2 xl:col-span-3"
            value={trademark}
            onChange={(e) => setTrademark(e.target.value)}
          />
          <Input
            type="number"
            min="1"
            max="45"
            placeholder="Class"
            value={classNo}
            onChange={(e) => setClassNo(e.target.value)}
          />

          <button className="md:col-span-2 xl:col-span-4 w-full bg-[#3E4A8A] hover:bg-[#2f3970] text-white py-2.5 rounded-lg font-semibold">
            Add Entry
          </button>
        </form>
      </div>

      {/* SEARCH */}
      <div className="bg-white rounded-xl shadow border p-4 sm:p-6">
        <h3 className="font-semibold text-gray-700 mb-3">Search Journal</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <Input placeholder="Journal Number" value={journalNumber} onChange={(e) => setJournalNumber(e.target.value)} />
          <Input placeholder="Application Number" value={applicationNumber} onChange={(e) => setApplicationNumber(e.target.value)} />
          <Input placeholder="Trademark Text" value={searchText} onChange={(e) => setSearchText(e.target.value)} />

          <button
            onClick={handleSearch}
            className="w-full bg-[#3E4A8A] hover:bg-[#2f3970] text-white py-2.5 rounded-lg font-semibold"
          >
            Search
          </button>
        </div>
      </div>

      {/* CARDS VIEW (MOBILE + TABLET) */}
      <div className="space-y-3 lg:hidden">
        {entries.map((e, i) => (
          <div key={e._id} className="bg-white border rounded-xl p-4 shadow text-sm space-y-1">
            <p className="text-gray-400">#{i + 1}</p>
            <p><b>Date:</b> {new Date(e.journalDate).toLocaleDateString()}</p>
            <p><b>Journal:</b> {e.journalNumber}</p>
            <p><b>Application:</b> {e.applicationNumber}</p>
            <p className="break-words"><b>Trademark:</b> {e.trademark}</p>
            <p><b>Class:</b> {e.class}</p>

            <button
              onClick={() => deleteEntry(e._id)}
              className="w-full mt-2 py-2 border border-red-300 text-red-600 rounded-md font-semibold"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* TABLE VIEW (DESKTOP ONLY) */}
      <div className="hidden lg:block bg-white rounded-xl shadow border p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-3">
          Journal Records ({entries.length})
        </h3>

        <table className="w-full table-auto text-sm">
          <thead className="bg-blue-50">
            <tr>
              <Th className="text-[#3E4A8A]">#</Th>
              <Th className="text-[#3E4A8A]">Date</Th>
              <Th className="text-[#3E4A8A]">Journal #</Th>
              <Th className="text-[#3E4A8A]">Application #</Th>
              <Th className="text-[#3E4A8A]">Trademark</Th>
              <Th className="text-[#3E4A8A]">Class</Th>
              <Th className="text-[#3E4A8A]">Action</Th>
            </tr>
          </thead>

          <tbody>
            {entries.map((e, i) => (
              <tr key={e._id} className="hover:bg-gray-50">
                <Td>{i + 1}</Td>
                <Td>{new Date(e.journalDate).toLocaleDateString()}</Td>
                <Td>{e.journalNumber}</Td>
                <Td>{e.applicationNumber}</Td>
                <Td className="max-w-[300px] truncate">{e.trademark}</Td>
                <Td>{e.class}</Td>
                <Td>
                  <button onClick={() => deleteEntry(e._id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default MonthlyJournal;

/* ================= UI HELPERS ================= */
const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4A8A] ${className}`}
  />
);

const Th = ({ children, className = "" }) => (
  <th className={`border px-3 py-2 text-left font-bold whitespace-nowrap ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`border px-3 py-2 text-gray-800 break-words ${className}`}>
    {children}
  </td>
);