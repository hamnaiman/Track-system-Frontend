import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../../api/api";

import Documents from "./Documents";
import Forms from "./Forms";
import Reports from "./Reports";

const tabs = [
  { key: "details", label: "Details" },
  { key: "documents", label: "Documents" },
  { key: "forms", label: "Form Entries" },
  { key: "reports", label: "Reports" }
];

const OppositionDetails = () => {
  const [searchParams] = useSearchParams();
  const oppositionNumber = searchParams.get("oppositionNumber");

  const [activeTab, setActiveTab] = useState("details");
  const [loading, setLoading] = useState(true);
  const [opposition, setOpposition] = useState(null);
  const [error, setError] = useState("");

  /* ================= FETCH OPPOSITION ================= */
  useEffect(() => {
    if (oppositionNumber) fetchOpposition();
  }, [oppositionNumber]);

  const fetchOpposition = async () => {
    try {
      setLoading(true);

      // ✅ CORRECT API
      const res = await api.get(`/oppositions/${oppositionNumber}`);

      setOpposition(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load opposition details");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATES ================= */
  if (!oppositionNumber) {
    return <div className="p-6 text-red-600">Opposition number missing in URL</div>;
  }

  if (loading) {
    return <div className="p-6 text-gray-500">Loading opposition details…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  /* ================= UI ================= */
  return (
    <div className="space-y-6">

      {/* ===== HEADER ===== */}
      <div className="bg-white border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Info label="Opposition No" value={opposition.oppositionNumber} />
          <Info label="Application No" value={opposition.applicationNumber} />
          <Info label="Status" value={opposition.status} />

          <Info label="Opposition Type" value={opposition.oppositionType} />
          <Info label="Journal No" value={opposition.trademarkJournalNumber} />
          <Info
            label="Opposition Date"
            value={
              opposition.oppositionDate
                ? new Date(opposition.oppositionDate).toLocaleDateString()
                : "—"
            }
          />
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="bg-white border rounded-xl">

        {/* TAB HEADERS */}
        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition
                ${
                  activeTab === tab.key
                    ? "border-[#3E4A8A] text-[#3E4A8A]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="p-6">

          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <Detail label="Trademark" value={opposition.trademark} />
              <Detail label="Client" value={opposition.clientId?.customerName} />
              <Detail label="Created By" value={opposition.createdBy?._id} />
              <Detail
                label="Created On"
                value={new Date(opposition.createdAt).toLocaleString()}
              />
            </div>
          )}

          {activeTab === "documents" && (
            <Documents oppositionNumber={opposition.oppositionNumber} />
          )}

          {activeTab === "forms" && (
            <Forms applicationNumber={opposition.applicationNumber} />
          )}

          {activeTab === "reports" && (
            <Reports oppositionNumber={opposition.oppositionNumber} />
          )}

        </div>
      </div>
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-800 mt-1">{value || "—"}</p>
  </div>
);

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="mt-1 text-gray-800">{value || "—"}</p>
  </div>
);

export default OppositionDetails;
