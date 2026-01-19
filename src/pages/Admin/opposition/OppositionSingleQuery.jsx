import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const OppositionSingleQuery = () => {
  const [searchBy, setSearchBy] = useState("oppositionNumber");
  const [searchValue, setSearchValue] = useState("");
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.warning("Please enter search value");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get("/opposition/single-query", {
        params: { searchBy, value: searchValue }
      });

      if (!res.data?.data) {
        toast.info("No record found");
        setRecord(null);
      } else {
        setRecord(res.data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed");
      setRecord(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ================= HEADER CARD ================= */}
        <div className="bg-white rounded-2xl shadow border p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-[#3E4A8A]">
            Opposition Single Query
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Search and print opposition record details
          </p>
        </div>

        {/* ================= SEARCH PANEL ================= */}
        <div className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="oppositionNumber">Opposition #</option>
            <option value="clientName">Client Name</option>
            <option value="trademark">Trademark</option>
            <option value="applicationNumber">Application #</option>
          </select>

          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Enter value"
            className="border rounded-lg px-3 py-2 md:col-span-2"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-[#3E4A8A] text-white rounded-lg hover:bg-[#2f3970]"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* ================= RESULT ================= */}
        {record && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-6">

            {/* PRINT HEADER */}
            <div className="hidden print:block border-b pb-4 mb-6">
              <div className="flex items-center gap-4">
                <img
                  src="/logo.jpg"
                  alt="Logo"
                  className="h-16"
                />
                <div>
                  <h2 className="text-xl font-bold">
                    Intellectual Property Law Firm
                  </h2>
                  <p className="text-sm">
                    Trademark & Legal Consultants<br />
                    info@iplaw.com | 021-XXXXXXX
                  </p>
                </div>
              </div>
            </div>

            {/* OPPOSITION DETAILS */}
            <Section title="Opposition Details">
              <Field label="Opposition #" value={record.oppositionNumber} />
              <Field label="File #" value={record.fileNumber} />
              <Field label="Opposition Date" value={record.oppositionDate} />
              <Field label="Type" value={record.oppositionType} />
              <Field label="Status" value={record.status} />
              <Field label="Remarks" value={record.remarks} full />
            </Section>

            {/* TRADEMARK DETAILS */}
            <Section title="Trademark Details">
              <Field label="Application #" value={record.applicationNumber} />
              <Field label="Client" value={record.clientName} />
              <Field label="Trademark" value={record.trademark} />
              <Field label="Goods / Description" value={record.goods} full />
            </Section>

            {/* ACTIONS */}
            <div className="flex justify-end print:hidden">
              <button
                onClick={() => window.print()}
                className="border px-6 py-2 rounded-lg hover:bg-gray-100"
              >
                Print
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- REUSABLE ---------- */
const Section = ({ title, children }) => (
  <div>
    <h2 className="text-lg font-semibold text-[#3E4A8A] mb-3">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
      {children}
    </div>
  </div>
);

const Field = ({ label, value, full }) => (
  <div className={full ? "md:col-span-3" : ""}>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <div className="border rounded-lg px-3 py-2 bg-gray-50 min-h-[38px]">
      {value || "-"}
    </div>
  </div>
);

export default OppositionSingleQuery;
