import { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApps(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      toast.error("Failed to load applications");
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
          Trademark Applications
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          View applications assigned to you
        </p>
      </div>

      {/* ================= MOBILE VIEW (CARDS) ================= */}
      <div className="grid gap-4 sm:hidden">
        {loading ? (
          <p className="text-center text-gray-500">Loading applications...</p>
        ) : apps.length === 0 ? (
          <p className="text-center text-gray-400">No applications found</p>
        ) : (
          apps.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-xl border shadow-sm p-4 space-y-2"
            >
              <div>
                <p className="text-xs text-gray-400">Application #</p>
                <p className="font-semibold text-[#3E4A8A]">
                  {a.applicationNumber || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Trademark</p>
                <p className="text-sm text-gray-700">
                  {a.trademark || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Client</p>
                <p className="text-sm text-gray-700">
                  {a.client?.customerName || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Reminder Date</p>
                {a.reminderDate ? (
                  <span className="inline-block mt-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    {new Date(a.reminderDate).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= TABLE VIEW (TABLET + DESKTOP) ================= */}
      <div className="hidden sm:block bg-white rounded-xl shadow-sm border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-600">
              <th className="p-3 md:p-4 text-left">Application #</th>
              <th className="p-3 md:p-4 text-left">Trademark</th>
              <th className="p-3 md:p-4 text-left">Client</th>
              <th className="p-3 md:p-4 text-left">Reminder Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  Loading applications...
                </td>
              </tr>
            ) : apps.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-400">
                  No applications found
                </td>
              </tr>
            ) : (
              apps.map((a, index) => (
                <tr
                  key={a._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="p-3 md:p-4 font-semibold text-[#3E4A8A]">
                    {a.applicationNumber || "-"}
                  </td>
                  <td className="p-3 md:p-4 text-gray-700">
                    {a.trademark || "-"}
                  </td>
                  <td className="p-3 md:p-4 text-gray-700">
                    {a.client?.customerName || "-"}
                  </td>
                  <td className="p-3 md:p-4">
                    {a.reminderDate ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                        {new Date(a.reminderDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
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

export default Applications;