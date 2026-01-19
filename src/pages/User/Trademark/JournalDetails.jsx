import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const JournalDetails = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [journal, setJournal] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD USER APPLICATIONS ================= */
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.get("/applications");
      const apps = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setApplications(apps);
    } catch {
      setError("Failed to load applications");
    }
  };

  /* ================= LOAD JOURNAL ================= */
  const loadJournal = async (appId) => {
    if (!appId) return;

    setLoading(true);
    setJournal(null);
    setError("");

    try {
      const res = await api.get(`/journals/${appId}`);
      setJournal(res.data?.data || null);
    } catch {
      setError("No journal record found for this application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#3E4A8A]">
          Journal Details
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          View journal publication record of your trademark applications
        </p>
      </div>

      {/* ===== APPLICATION SELECT ===== */}
      <div className="bg-white border rounded-lg shadow-sm p-4 sm:p-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Application
        </label>

        <select
          className="w-full border rounded px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-[#3E4A8A]/30"
          value={selectedApp}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedApp(value);
            loadJournal(value);
          }}
        >
          <option value="">-- Select Application --</option>

          {applications.length === 0 && (
            <option disabled>No applications found</option>
          )}

          {applications.map((app) => (
            <option key={app._id} value={app._id}>
              {app.applicationNumber} — {app.trademark}
            </option>
          ))}
        </select>
      </div>

      {/* ===== LOADING ===== */}
      {loading && (
        <div className="text-sm text-gray-500">
          Loading journal details...
        </div>
      )}

      {/* ===== ERROR ===== */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* ===== JOURNAL DATA ===== */}
      {!loading && journal && (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">

          {/* APPLICATION INFO */}
          <div className="px-4 py-3 border-b bg-gray-50 text-sm space-y-1">
            <p>
              <span className="font-medium text-gray-700">
                Application No:
              </span>{" "}
              {journal.application?.applicationNumber}
            </p>
            <p>
              <span className="font-medium text-gray-700">
                Trademark:
              </span>{" "}
              {journal.application?.trademark}
            </p>
          </div>

          {/* ================= DESKTOP TABLE ================= */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-blue-50 text-[#3E4A8A]">
  <tr>
    <th className="border px-4 py-2 text-left font-semibold">
      Journal #
    </th>
    <th className="border px-4 py-2 text-left font-semibold">
      Page #
    </th>
    <th className="border px-4 py-2 text-left font-semibold">
      Journal Date
    </th>
    <th className="border px-4 py-2 text-left font-semibold">
      Published Date
    </th>
    <th className="border px-4 py-2 text-left font-semibold">
      Remark
    </th>
  </tr>
</thead>


              <tbody>
                {journal.entries?.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No journal entries available
                    </td>
                  </tr>
                )}

                {journal.entries?.map((entry) => (
                  <tr key={entry._id} className="hover:bg-blue-50">
                    <td className="border px-4 py-2">{entry.jNo}</td>
                    <td className="border px-4 py-2">{entry.pageNo}</td>
                    <td className="border px-4 py-2">
                      {new Date(entry.journalDate).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      {new Date(entry.publishedDate).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      {entry.remark || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= MOBILE CARD VIEW ================= */}
          <div className="sm:hidden p-4 space-y-4">
            {journal.entries?.length === 0 && (
              <p className="text-center text-gray-500 text-sm">
                No journal entries available
              </p>
            )}

            {journal.entries?.map((entry) => (
              <div
                key={entry._id}
                className="border rounded-lg p-4 shadow-sm space-y-2"
              >
                <Row label="Journal #" value={entry.jNo} />
                <Row label="Page #" value={entry.pageNo} />
                <Row
                  label="Journal Date"
                  value={new Date(entry.journalDate).toLocaleDateString()}
                />
                <Row
                  label="Published Date"
                  value={new Date(entry.publishedDate).toLocaleDateString()}
                />

                <div className="text-sm">
                  <span className="font-medium text-gray-600">Remark:</span>
                  <p className="text-gray-700 mt-1">
                    {entry.remark || "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

/* ===== SMALL HELPER COMPONENT ===== */
const Row = ({ label, value }) => (
  <div className="flex justify-between text-sm">
    <span className="font-medium text-gray-600">{label}</span>
    <span>{value}</span>
  </div>
);

export default JournalDetails;
