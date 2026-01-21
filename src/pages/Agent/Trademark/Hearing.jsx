import { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const Hearings = () => {
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadApplicationsAndHearings();
  }, []);

  const loadApplicationsAndHearings = async () => {
    try {
      // 🔹 1. Load applications
      const res = await api.get("/applications");
      const apps = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      if (!apps.length) {
        setHearings([]);
        return;
      }

      // 🔹 2. Load hearings in PARALLEL (FAST)
      const requests = apps.map((app) =>
        api
          .get(`/hearings/${app._id}`)
          .then((res) =>
            res.data?.hearings?.length ? res.data : null
          )
          .catch(() => null)
      );

      const results = await Promise.all(requests);

      setHearings(results.filter(Boolean));
    } catch (err) {
      toast.error("Failed to load hearing data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl sm:text-xl md:text-2xl font-bold text-[#3E4A8A]">
          Hearing Details
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Hearing history for agent applications
        </p>
      </div>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="text-center text-gray-500 text-xs py-8">
          Loading hearing records...
        </div>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && hearings.length === 0 && (
        <div className="bg-white rounded-xl shadow p-6 text-center text-xs text-gray-400">
          No hearings found
        </div>
      )}

      {/* ================= MOBILE ================= */}
      {!loading && hearings.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:hidden">
          {hearings.map((h) =>
            h.hearings.map((e) => (
              <div
                key={e._id}
                className="bg-white border rounded-xl shadow-sm p-4 space-y-2 text-[12px]"
              >
                <p className="text-gray-400 text-[11px]">
                  Application #{h.application?.applicationNumber || "—"}
                </p>

                <div className="flex justify-between gap-3">
                  <span className="font-semibold">Date:</span>
                  <span>
                    {new Date(e.hearingDate).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <span className="font-semibold">Before:</span>
                  <p className="break-words text-gray-700">
                    {e.before || "—"}
                  </p>
                </div>

                <div>
                  <span className="font-semibold">Comments:</span>
                  <p className="break-words text-gray-600">
                    {e.commentsArguments || "—"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= TABLE ================= */}
      {!loading && hearings.length > 0 && (
        <div className="hidden sm:block bg-white rounded-xl shadow border overflow-x-auto">
          <table className="min-w-[900px] w-full text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Application #</th>
                <th className="p-3 text-left">Hearing Date</th>
                <th className="p-3 text-left">Before</th>
                <th className="p-3 text-left">Comments / Arguments</th>
              </tr>
            </thead>

            <tbody>
              {hearings.map((h) =>
                h.hearings.map((e) => (
                  <tr key={e._id} className="hover:bg-blue-50 transition">
                    <td className="p-3 border-b">
                      {h.application?.applicationNumber || "—"}
                    </td>

                    <td className="p-3 border-b">
                      {new Date(e.hearingDate).toLocaleDateString()}
                    </td>

                    <td className="p-3 border-b max-w-[200px] break-words">
                      {e.before || "—"}
                    </td>

                    <td className="p-3 border-b max-w-[420px] break-words">
                      {e.commentsArguments || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default Hearings;
