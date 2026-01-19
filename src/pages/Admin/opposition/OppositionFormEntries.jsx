import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const OppositionFormEntries = () => {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    oppositionNumber: "",
    formNumber: "",
    filingDate: "",
    remarks: "",
  });

  /* ================= FETCH GRID ================= */
  const fetchEntries = async () => {
    if (!applicationNumber.trim()) {
      toast.warning("Enter application number");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(
        `/opposition/forms?applicationNumber=${applicationNumber}`
      );
      setEntries(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load entries");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD ENTRY ================= */
  const handleAdd = async () => {
    const { oppositionNumber, formNumber, filingDate } = form;

    if (!oppositionNumber || !formNumber || !filingDate) {
      toast.error("All required fields must be filled");
      return;
    }

    try {
      await api.post("/opposition/forms", {
        applicationNumber,
        ...form,
      });

      toast.success("Opposition form entry added");

      setForm({
        oppositionNumber: "",
        formNumber: "",
        filingDate: "",
        remarks: "",
      });

      fetchEntries();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add entry");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;

    try {
      await api.delete(`/opposition/forms/${id}`);
      toast.success("Entry deleted");
      fetchEntries();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-[70vh] px-3 sm:px-6 py-6 flex justify-center">
      <div className="w-full max-w-6xl bg-white border rounded-2xl shadow-lg p-4 sm:p-6 space-y-6">

        {/* HEADER */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#3E4A8A]">
            Opposition Form Entries
          </h2>
          <p className="text-sm text-gray-500">
            Manage opposition form submissions against an application
          </p>
        </div>

        {/* SEARCH */}
        <div className="bg-gray-50 border rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Application Number
            </label>
            <input
              value={applicationNumber}
              onChange={(e) => setApplicationNumber(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter Application Number"
            />
          </div>

          <button
            onClick={fetchEntries}
            className="w-full sm:w-auto bg-[#3E4A8A] text-white px-6 py-2 rounded-lg hover:bg-[#2f3970] font-semibold"
          >
            Search
          </button>
        </div>

        {/* FORM ENTRY */}
        <div className="border rounded-xl bg-gray-50 p-4 sm:p-5 space-y-4">
          <h3 className="font-semibold text-[#3E4A8A] mb-4">
            Add Opposition Form Entry
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <input
              placeholder="Opposition Number"
              value={form.oppositionNumber}
              onChange={(e) =>
                setForm({ ...form, oppositionNumber: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full"
            />

            <input
              placeholder="Form Number"
              value={form.formNumber}
              onChange={(e) =>
                setForm({ ...form, formNumber: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full"
            />

            <input
              type="date"
              value={form.filingDate}
              onChange={(e) =>
                setForm({ ...form, filingDate: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full"
            />

            <input
              placeholder="Remarks (optional)"
              value={form.remarks}
              onChange={(e) =>
                setForm({ ...form, remarks: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full"
            />
          </div>

          <button
            onClick={handleAdd}
            className="w-full sm:w-auto bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Save Entry
          </button>
        </div>

        {/* TABLE FOR DESKTOP */}
        <div className="hidden md:block overflow-x-auto border rounded-xl">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <Th>Form #</Th>
                <Th>Filing Date</Th>
                <Th>Remarks</Th>
                <Th className="text-center">Action</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <Td colSpan={4} className="text-center text-gray-500">
                    Loading...
                  </Td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <Td colSpan={4} className="text-center text-gray-500">
                    No entries found
                  </Td>
                </tr>
              ) : (
                entries.map((e) => (
                  <tr key={e._id} className="border-t hover:bg-gray-50">
                    <Td>{e.formNumber}</Td>
                    <Td>{new Date(e.filingDate).toLocaleDateString()}</Td>
                    <Td>{e.remarks || "-"}</Td>
                    <Td className="text-center">
                      <button
                        onClick={() => handleDelete(e._id)}
                        className="text-red-600 hover:underline font-semibold"
                      >
                        Delete
                      </button>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden space-y-3">
          {entries.map((e) => (
            <div key={e._id} className="border rounded-xl p-4 bg-white shadow space-y-2">
              <p><b>Form #:</b> {e.formNumber}</p>
              <p><b>Filing Date:</b> {new Date(e.filingDate).toLocaleDateString()}</p>
              <p><b>Remarks:</b> {e.remarks || "-"}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => handleDelete(e._id)}
                  className="text-red-600 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

/* ================= HELPERS ================= */
const Th = ({ children, className = "" }) => (
  <th className={`p-3 border text-left font-bold text-[#3E4A8A] bg-blue-50 ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "", colSpan }) => (
  <td className={`p-3 border font-semibold ${className}`} colSpan={colSpan}>
    {children}
  </td>
);

export default OppositionFormEntries;