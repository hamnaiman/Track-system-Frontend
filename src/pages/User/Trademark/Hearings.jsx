import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const Hearings = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [hearingData, setHearingData] = useState(null);
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
    } catch (err) {
      console.error(err);
      setApplications([]);
      setError("Failed to load applications");
    }
  };

  /* ================= LOAD HEARINGS ================= */
  const loadHearings = async (appId) => {
    if (!appId) return;

    setLoading(true);
    setHearingData(null);
    setError("");

    try {
      const res = await api.get(`/hearings/${appId}`);
      setHearingData(res.data);
    } catch {
      setError("No hearing record found for this application");
      setHearingData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Hearings
        </h2>
        <p className="text-sm text-gray-500">
          View date-wise hearing records of your trademark applications
        </p>
      </div>

      {/* ===== APPLICATION SELECT CARD ===== */}
      <div className="bg-white border rounded-lg shadow-sm p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Application
        </label>

        <select
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={selectedApp}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedApp(value);
            loadHearings(value);
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
        <div className="text-gray-500 text-sm">Loading hearing details...</div>
      )}

      {/* ===== ERROR ===== */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* ===== HEARING DATA ===== */}
      {!loading && hearingData && (
        <>
          {/* APPLICATION INFO */}
          <div className="bg-white border rounded-lg shadow-sm px-4 py-3 text-sm">
            <p>
              <span className="font-medium text-gray-700">Application No:</span>{" "}
              {hearingData.application?.applicationNumber || "-"}
            </p>
            <p>
              <span className="font-medium text-gray-700">Trademark:</span>{" "}
              {hearingData.application?.trademark || "-"}
            </p>
          </div>

          {/* ===== MOBILE CARDS ===== */}
          <div className="space-y-3 sm:hidden">
            {hearingData.hearings?.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No hearing records found
              </div>
            ) : (
              hearingData.hearings.map((row) => (
                <div
                  key={row._id}
                  className="bg-white border rounded-lg shadow-sm p-4 space-y-2"
                >
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>{" "}
                    {row.hearingDate ? new Date(row.hearingDate).toLocaleDateString() : "-"}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Before:</span>{" "}
                    {row.before || "-"}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Comments:</span>{" "}
                    <span className="break-words">{row.commentsArguments || "-"}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Advocate:</span>{" "}
                    {row.advocateAppeared || "-"}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ===== DESKTOP TABLE ===== */}
          <div className="hidden sm:block bg-white border rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border px-4 py-2 text-left whitespace-nowrap">Hearing Date</th>
                  <th className="border px-4 py-2 text-left">Before</th>
                  <th className="border px-4 py-2 text-left">Comments / Arguments</th>
                  <th className="border px-4 py-2 text-left">Advocate Appeared</th>
                </tr>
              </thead>
              <tbody>
                {hearingData.hearings?.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No hearing records found
                    </td>
                  </tr>
                ) : (
                  hearingData.hearings?.map((row) => (
                    <tr key={row._id} className="hover:bg-blue-50 transition">
                      <td className="border px-4 py-2 whitespace-nowrap">
                        {row.hearingDate ? new Date(row.hearingDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="border px-4 py-2">{row.before || "-"}</td>
                      <td className="border px-4 py-2 break-words max-w-xs">{row.commentsArguments || "-"}</td>
                      <td className="border px-4 py-2">{row.advocateAppeared || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Hearings;
