import { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const Renewals = () => {
  const [applications, setApplications] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD APPLICATIONS ================= */
  const loadApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(res.data?.data || []);
    } catch {
      toast.error("Failed to load applications");
    }
  };

  /* ================= LOAD RENEWALS (FAST – PARALLEL) ================= */
  const loadRenewals = async () => {
    setLoading(true);

    try {
      const requests = applications.map((app) =>
        api
          .get(`/renewals/${app._id}`)
          .then((res) => ({
            app,
            entries: res.data?.entries || [],
          }))
          .catch(() => null) // no renewal → ignore
      );

      const results = await Promise.all(requests);

      const list = [];

      results.forEach((result) => {
        if (!result) return;

        const { app, entries } = result;

        entries.forEach((e) => {
          list.push({
            applicationNumber: app.applicationNumber,
            trademark: app.trademark,
            renewedUpto: e.renewedUpto,
            remark: e.remark,
          });
        });
      });

      setRows(list);
    } catch {
      toast.error("Failed to load renewals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    if (applications.length) {
      loadRenewals();
    }
  }, [applications]);

  return (
    <div className="space-y-6">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Renewal History
        </h2>
        <p className="text-sm text-gray-500">
          View trademark renewal records (read-only)
        </p>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="bg-white rounded-2xl shadow border overflow-x-auto">

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading renewal records...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No renewal records found
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border text-left">Application #</th>
                <th className="p-3 border text-left">Trademark</th>
                <th className="p-3 border text-left">Renewed Upto</th>
                <th className="p-3 border text-left">Remark</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="p-3 border font-medium">
                    {r.applicationNumber}
                  </td>

                  <td className="p-3 border">
                    {r.trademark}
                  </td>

                  <td className="p-3 border">
                    {r.renewedUpto
                      ? new Date(r.renewedUpto).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="p-3 border text-gray-600">
                    {r.remark || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
};

export default Renewals;
