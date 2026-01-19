import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const OppositionDocuments = () => {
  const [oppositionNumber, setOppositionNumber] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const [trademark, setTrademark] = useState("");
  const [documents, setDocuments] = useState([]);

  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [showToClient, setShowToClient] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH GRID ================= */
  const fetchDocuments = async () => {
    if (!oppositionNumber.trim()) {
      toast.warning("Opposition / Rectification number is required");
      return;
    }

    try {
      const res = await api.get(
        `/opposition-documents?oppositionNumber=${oppositionNumber}`
      );
      setDocuments(res.data || []);
    } catch {
      toast.error("Failed to load opposition documents");
    }
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async () => {
    if (!oppositionNumber || !file || !remarks) {
      return toast.error("Opposition number, file and remarks are required");
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("oppositionNumber", oppositionNumber);
    formData.append("applicationNumber", applicationNumber);
    formData.append("trademark", trademark);
    formData.append("remarks", remarks);
    formData.append("showToClient", showToClient);

    try {
      setLoading(true);
      await api.post("/opposition-documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Document uploaded successfully");
      setFile(null);
      setRemarks("");
      setShowToClient(false);
      fetchDocuments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DOWNLOAD ================= */
  const handleDownload = async (doc) => {
    const res = await api.get(
      `/opposition-documents/download/${doc._id}`,
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.fileName;
    a.click();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    await api.delete(`/opposition-documents/${id}`);
    toast.success("Document deleted");
    fetchDocuments();
  };

  return (
    <div className="min-h-[70vh] px-3 sm:px-6 py-6 flex justify-center">
      <div className="w-full max-w-6xl bg-white border rounded-2xl shadow-lg p-4 sm:p-6 space-y-6">

        {/* HEADER */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#3E4A8A]">
            Opposition Documents
          </h2>
          <p className="text-sm text-gray-500">
            Upload & manage opposition / rectification related documents
          </p>
        </div>

        {/* SEARCH INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Opposition / Rectification No."
            value={oppositionNumber}
            onChange={(e) => setOppositionNumber(e.target.value)}
          />
          <input
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Application Number"
            value={applicationNumber}
            onChange={(e) => setApplicationNumber(e.target.value)}
          />
          <input
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Trademark"
            value={trademark}
            onChange={(e) => setTrademark(e.target.value)}
          />
        </div>

        <button
          onClick={fetchDocuments}
          className="w-full md:w-auto bg-[#3E4A8A] text-white px-6 py-2 rounded-lg hover:bg-[#2f3970] font-semibold"
        >
          View Documents
        </button>

        {/* UPLOAD CARD */}
        <div className="border rounded-xl bg-gray-50 p-4 sm:p-5 space-y-4">
          <h3 className="font-semibold text-[#3E4A8A]">Upload Document</h3>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          />

          <input
            className="border rounded-lg px-3 py-2 w-full"
            placeholder="Clear description / remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <label className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
            <input
              type="checkbox"
              checked={showToClient}
              onChange={(e) => setShowToClient(e.target.checked)}
            />
            Show to Client
          </label>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full sm:w-auto bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {/* DOCUMENT TABLE FOR DESKTOP */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <Th>#</Th>
                <Th>Document</Th>
                <Th>Show To Client</Th>
                <Th>Remarks</Th>
                <Th className="text-center">Action</Th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 font-semibold">
                    No documents found
                  </td>
                </tr>
              )}
              {documents.map((d, i) => (
                <tr key={d._id} className="hover:bg-gray-50">
                  <Td>{i + 1}</Td>
                  <Td>
                    <button
                      className="text-[#3E4A8A] font-semibold underline"
                      onClick={() => handleDownload(d)}
                    >
                      Download
                    </button>
                  </Td>
                  <Td>{d.showToClient ? "Yes" : "No"}</Td>
                  <Td>{d.remarks}</Td>
                  <Td className="text-center">
                    <button
                      className="text-red-600 font-semibold"
                      onClick={() => handleDelete(d._id)}
                    >
                      Delete
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden space-y-4">
          {documents.map((d, i) => (
            <div key={d._id} className="bg-white p-4 rounded-2xl shadow border space-y-2 text-sm">
              <p><b>#:</b> {i + 1}</p>
              <p>
                <b>Document:</b>{" "}
                <button
                  className="text-[#3E4A8A] font-semibold underline"
                  onClick={() => handleDownload(d)}
                >
                  Download
                </button>
              </p>
              <p><b>Show To Client:</b> {d.showToClient ? "Yes" : "No"}</p>
              <p><b>Remarks:</b> {d.remarks}</p>
              <div className="flex justify-end pt-2">
                <button
                  className="text-red-600 font-semibold"
                  onClick={() => handleDelete(d._id)}
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

const Td = ({ children, className = "" }) => (
  <td className={`p-3 border font-semibold ${className}`}>
    {children}
  </td>
);

export default OppositionDocuments;