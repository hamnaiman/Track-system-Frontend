import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const TMDocuments = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD USER APPLICATIONS ================= */
  useEffect(() => {
    fetchApplications();
  }, []);

  const normalizeArrayResponse = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.data)) return res.data.data;
    return [];
  };

  const fetchApplications = async () => {
    setLoadingApps(true);
    setError("");

    try {
      const res = await api.get("/applications");
      const apps = normalizeArrayResponse(res.data);
      if (!apps.length) setError("No applications assigned to this account");
      setApplications(apps);
    } catch (err) {
      console.error("APPLICATION FETCH ERROR:", err);
      setError("Failed to load applications");
    } finally {
      setLoadingApps(false);
    }
  };

  /* ================= LOAD DOCUMENTS ================= */
  const fetchDocuments = async (applicationNumber) => {
    if (!applicationNumber) return;

    setLoadingDocs(true);
    setError("");
    setDocuments([]);

    try {
      const res = await api.get("/documents", {
        params: { applicationNumber },
      });
      const docs = normalizeArrayResponse(res.data);
      setDocuments(docs);
    } catch (err) {
      console.error("DOCUMENT FETCH ERROR:", err);
      setError("Failed to load documents");
    } finally {
      setLoadingDocs(false);
    }
  };

  /* ================= DOWNLOAD ================= */
  const downloadDocument = async (id, fileName) => {
    try {
      const res = await api.get(`/documents/download/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Download failed");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          TM Documents
        </h2>
        <p className="text-sm text-gray-500">
          View and download trademark related documents
        </p>
      </div>

      {/* APPLICATION SELECT */}
      <div className="bg-white border rounded-lg p-4">
        <label className="block text-sm font-medium mb-2">
          Select Application
        </label>
        <select
          className="w-full border rounded px-3 py-2"
          value={selectedApp}
          disabled={loadingApps}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedApp(value);
            fetchDocuments(value);
          }}
        >
          <option value="">
            {loadingApps ? "Loading applications..." : "-- Select Application --"}
          </option>
          {applications.map((app) => (
            <option key={app._id} value={app.applicationNumber}>
              {app.applicationNumber} — {app.trademark}
            </option>
          ))}
        </select>
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* LOADING DOCUMENTS */}
      {loadingDocs && (
        <div className="text-gray-500 text-sm">
          Loading documents...
        </div>
      )}

      {/* ===== MOBILE CARDS ===== */}
      {!loadingDocs && documents.length > 0 && (
        <div className="space-y-3 sm:hidden">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-white border rounded-lg shadow-sm p-4 space-y-2"
            >
              <div className="font-medium text-[#3E4A8A] break-words">{doc.fileName}</div>
              <div className="text-xs text-gray-600 break-words">
                <span className="font-medium">Remarks:</span> {doc.remarks || "-"}
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">Date:</span>{" "}
                {new Date(doc.createdAt).toLocaleDateString()}
              </div>
              <div className="text-right">
                <button
                  onClick={() => downloadDocument(doc._id, doc.fileName)}
                  className="text-[#3E4A8A] font-medium hover:underline text-sm"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== DESKTOP TABLE ===== */}
      {!loadingDocs && documents.length > 0 && (
        <div className="hidden sm:block bg-white border rounded-lg overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-blue-50 text-[#3E4A8A]">
  <tr>
    <th className="border px-4 py-2 text-left font-semibold">
      File
    </th>
    <th className="border px-4 py-2 text-left font-semibold">
      Remarks
    </th>
    <th className="border px-4 py-2 text-left font-semibold">
      Date
    </th>
    <th className="border px-4 py-2 text-center font-semibold">
      Action
    </th>
  </tr>
</thead>

            <tbody>
              {documents.map((doc) => (
                <tr key={doc._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 break-words">{doc.fileName}</td>
                  <td className="border px-4 py-2 break-words">{doc.remarks || "-"}</td>
                  <td className="border px-4 py-2">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() => downloadDocument(doc._id, doc.fileName)}
                      className="text-[#3E4A8A] font-medium hover:underline"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loadingDocs && selectedApp && documents.length === 0 && (
        <div className="text-center text-gray-500 text-sm py-6">
          No documents available for this application
        </div>
      )}

    </div>
  );
};

export default TMDocuments;
