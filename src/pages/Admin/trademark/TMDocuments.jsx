import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function TMDocuments() {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [showToClient, setShowToClient] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH DOCUMENTS ================= */
  const fetchDocuments = async () => {
    if (!applicationNumber) {
      toast.warning("Enter Application Number");
      return;
    }

    try {
      const res = await api.get(
        `/documents?applicationNumber=${applicationNumber}`
      );
      setDocuments(res.data || []);
    } catch {
      toast.error("Failed to load documents");
    }
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async () => {
    if (!applicationNumber || !file || !remarks) {
      return toast.error("All fields are required");
    }

    const formData = new FormData();
    formData.append("document", file);
    formData.append("applicationNumber", applicationNumber);
    formData.append("remarks", remarks);
    formData.append("showToClient", showToClient);

    try {
      setLoading(true);
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
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
    const res = await api.get(`/documents/download/${doc._id}`, {
      responseType: "blob"
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.fileName;
    a.click();
  };

  /* ================= DELETE (TOAST CONFIRM) ================= */
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p className="font-semibold mb-3">
            Delete this document?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/documents/${id}`);
                  toast.success("Document deleted");
                  fetchDocuments();
                } catch {
                  toast.error("Delete failed");
                }
                closeToast();
              }}
              className="bg-red-600 text-white px-4 py-1 rounded"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 space-y-8">

      {/* ================= SEARCH + HEADING ================= */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow border space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#3E4A8A]">
            TM Documents
          </h2>
          <p className="text-sm text-gray-500">
            Upload and manage trademark documents
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            className="px-4 py-3 rounded-lg bg-gray-100 border
                       focus:outline-none focus:ring-2 focus:ring-blue-200 w-full sm:w-80"
            placeholder="Enter Application Number"
            value={applicationNumber}
            onChange={(e) => setApplicationNumber(e.target.value)}
          />

          <button
            onClick={fetchDocuments}
            className="w-full sm:w-auto bg-[#3E4A8A] hover:bg-[#2f3970]
                       text-white px-8 py-3 rounded-lg font-semibold"
          >
            View Documents
          </button>
        </div>
      </div>

      {/* ================= UPLOAD ================= */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow border space-y-4">
        <h3 className="font-semibold text-[#3E4A8A]">Upload New Document</h3>

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
        />

        <input
          className="px-4 py-3 rounded-lg bg-gray-100 border w-full
                     focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Document remarks / description"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        <label className="flex items-center gap-2 text-sm font-semibold">
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
          className="w-full sm:w-auto bg-[#3E4A8A] hover:bg-[#2f3970]
                     text-white px-8 py-3 rounded-lg font-semibold"
        >
          {loading ? "Uploading..." : "Upload Document"}
        </button>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white rounded-2xl shadow border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-50 text-[#3E4A8A]">
            <tr>
              <Th>#</Th>
              <Th>Document</Th>
              <Th>Show To Client</Th>
              <Th>Remarks</Th>
              <Th className="text-center">Action</Th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center font-semibold">
                  Loading...
                </td>
              </tr>
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500 font-semibold">
                  No documents found
                </td>
              </tr>
            ) : (
              documents.map((d, i) => (
                <tr key={d._id} className="hover:bg-gray-50">
                  <Td>{i + 1}</Td>
                  <Td>
                    <button
                      onClick={() => handleDownload(d)}
                      className="text-[#3E4A8A] font-semibold underline"
                    >
                      Download
                    </button>
                  </Td>
                  <Td>{d.showToClient ? "Yes" : "No"}</Td>
                  <Td>{d.remarks}</Td>
                  <Td className="text-center">
                    <button
                      onClick={() => handleDelete(d._id)}
                      className="text-red-600 font-semibold"
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

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden space-y-4">
        {documents.map((d, i) => (
          <div
            key={d._id}
            className="bg-white p-4 rounded-2xl shadow border space-y-2 text-sm"
          >
            <p><b>#:</b> {i + 1}</p>
            <p>
              <b>Document:</b>{" "}
              <button
                onClick={() => handleDownload(d)}
                className="text-[#3E4A8A] font-semibold underline"
              >
                Download
              </button>
            </p>
            <p><b>Show To Client:</b> {d.showToClient ? "Yes" : "No"}</p>
            <p><b>Remarks:</b> {d.remarks}</p>

            <div className="flex justify-end gap-4 pt-2">
              <button
                onClick={() => handleDelete(d._id)}
                className="text-red-600 font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

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
