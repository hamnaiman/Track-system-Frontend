import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const TMSingleQuery = () => {
  const [searchBy, setSearchBy] = useState("applicationNumber");
  const [searchValue, setSearchValue] = useState("");
  const [appData, setAppData] = useState(null);

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.warning("Please enter search value");
      return;
    }

    try {
      const res = await api.post("/reports/tm-single-query", {
        searchBy,
        value: searchValue.trim(),
      });

      if (!res.data?.data) {
        toast.info("No record found");
        setAppData(null);
        return;
      }

      setAppData(res.data.data);
      toast.success("Record loaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">

      {/* ================= HEADER INSIDE WHITE CARD ================= */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        <h2 className="text-2xl font-bold text-[#3E4A8A] mb-2">
          TM Single Query
        </h2>
        <p className="text-sm text-gray-500">
          Search trademark application by number, file, or trademark name
        </p>
      </div>

      {/* ================= SEARCH CARD ================= */}
      <div className="bg-white rounded-2xl shadow border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
            <option value="applicationNumber">Application #</option>
            <option value="fileNumber">File #</option>
            <option value="trademark">Trademark</option>
          </Select>

          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Enter search value"
          />

          <button
            onClick={handleSearch}
            className="bg-[#3E4A8A] hover:bg-[#2f3970] text-white font-semibold rounded-lg px-6 py-3 transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* ================= RESULT ================= */}
      {appData && (
        <div className="bg-white rounded-2xl shadow border p-6">
          <h3 className="text-lg font-semibold text-[#3E4A8A] mb-6">
            Application Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Info label="Application #" value={appData.applicationNumber} />
            <Info label="File #" value={appData.fileNumber} />
            <Info label="Date of Filing" value={formatDate(appData.dateOfFiling)} />
            <Info label="Take Over Date" value={formatDate(appData.takeOverDate)} />
            <Info label="Period of Use" value={appData.periodOfUse} />
            <Info label="Trademark" value={appData.trademark} />
            <Info
              label="Classes"
              value={(appData.classes || []).map((c) => c.classNumber).join(", ")}
            />
            <Info label="Goods" value={appData.goods} />
            <Info label="Client" value={appData.client?.customerName} />
            <Info label="Show Cause Received" value={appData.showCauseReceived ? "Yes" : "No"} />
            <Info label="Evidence Submission Date" value={formatDate(appData.evidenceSubDate)} />
            <Info label="Acceptance Received Date" value={formatDate(appData.acceptanceReceivedDate)} />
            <Info label="Acceptance Sent to Client" value={appData.acceptanceSendToClient ? "Yes" : "No"} />
            <Info label="Opposition" value={appData.opposition ? "Yes" : "No"} />
            <Info label="Demand Note Received Date" value={formatDate(appData.demandNoteRecDate)} />
            <Info label="Demand Note Sent to Client" value={appData.demandNoteSendToClient ? "Yes" : "No"} />
            <Info label="Certificate Issued" value={appData.certificateIssued ? "Yes" : "No"} />
            <Info label="Certificate Received Date" value={formatDate(appData.certificateReceivedDate)} />
            <Info label="Status" value={appData.status?.description} />
            <Info label="Remarks" value={appData.remarks} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TMSingleQuery;

/* ================= SMALL COMPONENTS ================= */
const Input = (props) => (
  <input
    {...props}
    className="px-4 py-3 rounded-lg bg-gray-100 border focus:ring-1 focus:ring-[#3E4A8A] transition"
  />
);

const Select = ({ children, ...props }) => (
  <select
    {...props}
    className="px-4 py-3 rounded-lg bg-gray-100 border focus:ring-1 focus:ring-[#3E4A8A] transition"
  >
    {children}
  </select>
);

const Info = ({ label, value }) => (
  <div className="bg-gray-50 border rounded-lg p-4">
    <p className="text-xs text-gray-500 font-semibold mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800 break-words">{value || "-"}</p>
  </div>
);

const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "-");
