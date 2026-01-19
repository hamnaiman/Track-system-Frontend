import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const UserRenewalDetails = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [renewal, setRenewal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD USER APPLICATIONS ================= */
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.get("/applications");
      const apps = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setApplications(apps);
    } catch {
      setError("Failed to load applications");
    }
  };

  /* ================= LOAD RENEWALS ================= */
  const loadRenewals = async (applicationId) => {
    if (!applicationId) return;

    setLoading(true);
    setRenewal(null);
    setError("");

    try {
      const res = await api.get(`/renewals/${applicationId}`);
      setRenewal(res.data || { entries: [] });
    } catch {
      setError("No renewal record found for this application");
      setRenewal(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Renewal Details
        </h2>
        <p className="text-sm text-gray-500">
          View renewal history of your trademark applications
        </p>
      </div>

      {/* ===== APPLICATION SELECT ===== */}
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Application
        </label>

        <select
          className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-[#3E4A8A]"
          value={selectedApp}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedApp(value);
            loadRenewals(value);
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
          Loading renewal records...
        </div>
      )}

      {/* ===== ERROR ===== */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* ===== RENEWAL DATA ===== */}
      {!loading && renewal && (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">

          {/* APPLICATION INFO */}
          <div className="border-b px-4 py-3 bg-gray-50 text-sm">
            <p>
              <strong>Application No:</strong>{" "}
              {renewal.application?.applicationNumber || "-"}
            </p>
            <p>
              <strong>Trademark:</strong>{" "}
              {renewal.application?.trademark || "-"}
            </p>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse min-w-0">
            <thead className="bg-blue-50 text-[#3E4A8A] hidden sm:table-header-group">
  <tr>
    <th className="border px-4 py-2 text-left">Renewed Upto</th>
    <th className="border px-4 py-2 text-left">Remark</th>
    <th className="border px-4 py-2 text-left">Entry Date</th>
  </tr>
</thead>


              <tbody>
                {(!renewal.entries || renewal.entries.length === 0) && (
                  <tr>
                    <td colSpan="3" className="text-center py-8 text-gray-500">
                      No renewal history available
                    </td>
                  </tr>
                )}

                {renewal.entries?.map((entry) => (
                  <tr
                    key={entry._id}
                    className="hover:bg-blue-50 transition flex flex-col sm:table-row mb-4 sm:mb-0"
                  >
                    <td className="border px-4 py-2">
                      <span className="font-medium sm:hidden">Renewed Upto:</span>{" "}
                      {new Date(entry.renewedUpto).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      <span className="font-medium sm:hidden">Remark:</span>{" "}
                      {entry.remark || "-"}
                    </td>
                    <td className="border px-4 py-2">
                      <span className="font-medium sm:hidden">Entry Date:</span>{" "}
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ===== EMPTY STATE ===== */}
      {!loading && selectedApp && !renewal && !error && (
        <div className="text-center text-gray-500 text-sm py-8">
          No renewal data found for the selected application
        </div>
      )}

    </div>
  );
};

export default UserRenewalDetails;