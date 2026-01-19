import { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const Documents = () => {
  const [applications, setApplications] = useState([]);
  const [applicationNumber, setApplicationNumber] = useState("");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH AGENT APPLICATIONS ================= */
  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(res.data?.data || []);
    } catch {
      toast.error("Failed to load applications");
    }
  };

  /* ================= FETCH DOCUMENTS ================= */
  const fetchDocuments = async () => {
    if (!applicationNumber) {
      toast.warning("Please select an application first");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(
        `/documents?applicationNumber=${applicationNumber}`
      );
      setDocuments(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="space-y-6">


      {/* ===== HEADER ===== */}
      <div>
  <h2 className="text-2xl sm:text-xl md:text-2xl font-bold text-[#3E4A8A]">
    Application Documents
  </h2>
  <p className="text-xs sm:text-sm text-gray-500">
    View documents uploaded against trademark applications
  </p>
</div>


      {/* ===== SELECT APPLICATION ===== */}
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm border flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <select
          value={applicationNumber}
          onChange={(e) => {
            setApplicationNumber(e.target.value);
            setDocuments([]);
          }}
          className="w-full md:w-96 px-4 py-3 sm:px-5 sm:py-3 rounded-lg bg-gray-100 border
                     focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm sm:text-base"
        >
          <option value="">Select Application</option>
          {applications.map((app) => (
            <option key={app._id} value={app.applicationNumber}>
              {app.applicationNumber} — {app.trademark}
            </option>
          ))}
        </select>

        <button
          onClick={fetchDocuments}
          disabled={loading}
          className="bg-[#3E4A8A] hover:bg-[#2f3970]
                     text-white px-6 sm:px-8 py-3 rounded-lg font-semibold
                     disabled:opacity-60 text-sm sm:text-base w-full md:w-auto"
        >
          {loading ? "Loading..." : "View Documents"}
        </button>
      </div>

      {/* ===== DOCUMENTS TABLE / CARD VIEW ===== */}
      <div className="space-y-4">

        {loading ? (
          <div className="p-6 text-center text-gray-500 bg-white rounded-xl shadow-sm border">
            Loading documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="p-6 text-center text-gray-400 bg-white rounded-xl shadow-sm border">
            No documents found
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-x-auto">
              <table className="min-w-full w-full text-xs sm:text-sm md:text-base">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-3 sm:p-4 border-b text-left whitespace-nowrap">#</th>
                    <th className="p-3 sm:p-4 border-b text-left whitespace-nowrap">Remarks</th>
                    <th className="p-3 sm:p-4 border-b text-left whitespace-nowrap">Visible to Client</th>
                    <th className="p-3 sm:p-4 border-b text-center whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc, i) => (
                    <tr key={doc._id} className="hover:bg-gray-50 transition">
                      <td className="p-3 sm:p-4 border-b font-medium whitespace-nowrap">{i + 1}</td>
                      <td className="p-3 sm:p-4 border-b break-words max-w-xs">{doc.remarks || "—"}</td>
                      <td className="p-3 sm:p-4 border-b">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                            doc.showToClient
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {doc.showToClient ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 border-b text-center whitespace-nowrap">
                        <a
                          href={`http://localhost:5000/api/documents/download/${doc._id}`}
                          className="text-[#3E4A8A] font-semibold underline text-xs sm:text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {documents.map((doc, i) => (
                <div key={doc._id} className="bg-white p-4 rounded-xl shadow-sm border space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm">#{i + 1}</span>
                    <a
                      href={`http://localhost:5000/api/documents/download/${doc._id}`}
                      className="text-[#3E4A8A] font-semibold underline text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download
                    </a>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Remarks: </span>
                    <span className="text-gray-700 text-sm">{doc.remarks || "—"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Visible to Client: </span>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        doc.showToClient
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {doc.showToClient ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default Documents;