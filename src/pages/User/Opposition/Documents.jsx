import React, { useState } from "react";
import api from "../../../api/api";

const UserOppositionDocuments = () => {
  const [oppositionNumber, setOppositionNumber] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===== FETCH DOCUMENTS ===== */
  const fetchDocuments = async () => {
    if (!oppositionNumber) {
      setError("Opposition number is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.get("/opposition-documents", {
        params: { oppositionNumber }
      });

      // ✅ Only client-visible docs
      const visibleDocs = res.data.filter(
        (doc) => doc.showToClient === true
      );

      setDocuments(visibleDocs);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load documents"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===== DOWNLOAD ===== */
  const downloadDoc = async (id, fileName) => {
    try {
      const res = await api.get(
        `/opposition-documents/download/${id}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Failed to download document");
    }
  };

  return (
    <div className="space-y-8">

      {/* ===== HEADER (SYSTEM STYLE) ===== */}
     
<div>
  <h2 className="text-2xl font-bold text-[#3E4A8A]">
    Opposition Documents
  </h2>
  <p className="text-sm text-gray-500">
    View documents shared by agent or admin
  </p>
</div>


      {/* ===== SEARCH CARD ===== */}
      <div className="bg-white rounded-xl p-6 border space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="text"
            placeholder="Enter Opposition Number"
            value={oppositionNumber}
            onChange={(e) => setOppositionNumber(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm w-full sm:w-80 focus:ring-2 focus:ring-[#3E4A8A]"
          />

          <button
            onClick={fetchDocuments}
            className="bg-[#3E4A8A] text-white px-6 py-2 rounded-lg text-sm hover:opacity-90 transition"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* ===== ERROR ===== */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* ===== TABLE CARD ===== */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F4F6F8] text-[#3E4A8A]">
            <tr>
              <th className="p-3 text-left">File Name</th>
              <th className="p-3 text-left">Remarks</th>
              <th className="p-3 text-left">Uploaded On</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  Loading documents...
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No documents available
                </td>
              </tr>
            ) : (
              documents.map((doc) => (
                <tr
                  key={doc._id}
                  className="border-t hover:bg-[#F9FAFB]"
                >
                  <td className="p-3">{doc.fileName}</td>
                  <td className="p-3">{doc.remarks || "-"}</td>
                  <td className="p-3">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        downloadDoc(doc._id, doc.fileName)
                      }
                      className="text-[#3E4A8A] hover:underline text-sm font-medium"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default UserOppositionDocuments;
