import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const RenewalDetails = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [renewalData, setRenewalData] = useState(null);

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
      setApplications([]);
      setError("Failed to load applications");
    }
  };

  /* ================= LOAD RENEWALS ================= */
  const loadRenewals = async (appId) => {
    if (!appId) return;

    setLoading(true);
    setRenewalData(null);
    setError("");

    try {
      const res = await api.get(`/renewals/${appId}`);
      setRenewalData(res.data || { entries: [] });
    } catch {
      setError("No renewal record found for this application");
      setRenewalData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">

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
      <div className="bg-white border rounded-lg shadow-sm p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Application
        </label>

        <select
          value={selectedApp}
          onChange={(e) => {
            setSelectedApp(e.target.value);
            loadRenewals(e.target.value);
          }}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
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
      {!loading && renewalData && (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">

          {/* APPLICATION INFO */}
          <div className="px-4 py-3 border-b bg-gray-50 text-sm">
            <p>
              <span className="font-medium text-gray-700">
                Application No:
              </span>{" "}
              {renewalData.application?.applicationNumber || "-"}
            </p>
            <p>
              <span className="font-medium text-gray-700">
                Trademark:
              </span>{" "}
              {renewalData.application?.trademark || "-"}
            </p>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-blue-50 text-[#3E4A8A]">
                <tr>
                  <th className="border px-4 py-2 text-left whitespace-nowrap">
                    Renewed Upto
                  </th>
                  <th className="border px-4 py-2 text-left">
                    Remark
                  </th>
                </tr>
              </thead>

              <tbody>
                {renewalData.entries?.length === 0 && (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-center py-6 text-gray-500"
                    >
                      No renewal history found
                    </td>
                  </tr>
                )}

                {renewalData.entries?.map((entry) => (
                  <tr
                    key={entry._id}
                    className="hover:bg-blue-50 transition"
                  >
                    <td className="border px-4 py-2 whitespace-nowrap">
                      {new Date(entry.renewedUpto).toLocaleDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      {entry.remark || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
};

export default RenewalDetails;
