import React, { useState, useRef } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";
import PrintHeader from "../../../components/PrintHeader";

const UserTMSingleQuery = () => {
  const [searchBy, setSearchBy] = useState("applicationNumber");
  const [searchValue, setSearchValue] = useState("");
  const [appData, setAppData] = useState(null);
  const [allowPrint, setAllowPrint] = useState(false);
  const [loading, setLoading] = useState(false);

  const printRef = useRef();

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.warning("Please enter search value");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/reports/tm-single-query", {
        searchBy,
        value: searchValue.trim()
      });

      if (!res.data?.data) {
        toast.info("No record found");
        setAppData(null);
        setAllowPrint(false);
        return;
      }

      setAppData(res.data.data);
      setAllowPrint(res.data.meta?.allowPrint === true);

    } catch (err) {
      console.error(err);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= PRINT ================= */
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const win = window.open("", "", "width=900,height=650");

    win.document.write(`
      <html>
        <head>
          <title>Trademark Application</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 25px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
            .box { border: 1px solid #ddd; padding: 10px; border-radius: 6px; word-break: break-word; }
            .label { font-size: 11px; color: #555; font-weight: bold; }
            .value { font-size: 13px; margin-top: 4px; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
    win.close();
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Trademark Search
        </h2>
        <p className="text-sm text-gray-500">
          Search your trademark application details
        </p>
      </div>

      {/* ================= SEARCH BOX ================= */}
      <div className="bg-white border rounded-xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border"
          >
            <option value="applicationNumber">Application Number</option>
            <option value="fileNumber">File Number</option>
            <option value="trademark">Trademark Name</option>
          </select>

          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Enter value"
            className="w-full px-4 py-3 rounded-lg bg-gray-100 border"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-[#3E4A8A] text-white rounded-lg font-semibold
                       hover:bg-[#2f3970] disabled:opacity-60 py-3"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* ================= RESULT ================= */}
      {appData && (
        <>
          {/* ACTION BAR */}
          {allowPrint && (
            <div className="flex justify-end">
              <button
                onClick={handlePrint}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
              >
                Print
              </button>
            </div>
          )}

          {/* VIEW */}
          <div className="bg-white border rounded-xl p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-5">
              Application Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Info label="Application #" value={appData.applicationNumber} />
              <Info label="File #" value={appData.fileNumber} />
              <Info label="Trademark" value={appData.trademark} />
              <Info label="Client" value={appData.client?.customerName} />
              <Info label="Class" value={(appData.classes || []).map(c => c.classNumber).join(", ")} />
              <Info label="Goods" value={appData.goods} />
              <Info label="Period of Use" value={appData.periodOfUse} />
              <Info label="Status" value={appData.status?.description} />
              <Info label="Date of Filing" value={formatDate(appData.dateOfFiling)} />
              <Info label="Take Over Date" value={formatDate(appData.takeOverDate)} />
              <Info label="Opposition" value={appData.opposition ? "Yes" : "No"} />
              <Info label="Certificate Issued" value={appData.certificateIssued ? "Yes" : "No"} />
              <Info label="Remarks" value={appData.remarks} />
            </div>
          </div>

          {/* ================= PRINT LAYOUT ================= */}
          <div className="hidden">
            <div ref={printRef}>
              <PrintHeader title="Trademark Application Report" />

              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                <PrintItem label="Application #" value={appData.applicationNumber} />
                <PrintItem label="File #" value={appData.fileNumber} />
                <PrintItem label="Trademark" value={appData.trademark} />
                <PrintItem label="Client" value={appData.client?.customerName} />
                <PrintItem label="Class" value={(appData.classes || []).map(c => c.classNumber).join(", ")} />
                <PrintItem label="Goods" value={appData.goods} />
                <PrintItem label="Status" value={appData.status?.description} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserTMSingleQuery;

/* ================= SMALL COMPONENTS ================= */

const Info = ({ label, value }) => (
  <div className="bg-gray-50 border rounded-lg p-4 break-words">
    <p className="text-xs text-gray-500 font-semibold">{label}</p>
    <p className="text-sm text-gray-800 mt-1 break-words">
      {value || "—"}
    </p>
  </div>
);

const PrintItem = ({ label, value }) => (
  <div className="box" style={{ wordBreak: "break-word" }}>
    <div className="label">{label}</div>
    <div className="value">{value || "—"}</div>
  </div>
);

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString() : "—";