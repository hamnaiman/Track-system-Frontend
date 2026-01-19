import { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const AgentTMForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD TM FORMS ================= */
  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tm-forms");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setForms(data);
    } catch (err) {
      setError("TM Forms load failed");
      toast.error("TM Forms load failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" space-y-6">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-sm sm:text-base md:text-2xl font-bold text-[#3E4A8A]">
          TM Forms
        </h2>
        <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">
          Trademark forms reference list with priority
        </p>
      </div>

      {/* ===== ERROR ===== */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* ===== DESKTOP TABLE (md+) ===== */}
      <div className="hidden md:block bg-white rounded-xl shadow border overflow-x-auto">
        <table className="min-w-[650px] w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3 text-left whitespace-nowrap">
                Form No
              </th>
              <th className="p-3 text-left">
                Description
              </th>
              <th className="p-3 text-center whitespace-nowrap">
                Priority
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-400">
                  Loading TM Forms...
                </td>
              </tr>
            )}

            {!loading && forms.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-400">
                  No TM Forms found
                </td>
              </tr>
            )}

            {!loading &&
              forms.map((f) => (
                <tr
                  key={f._id}
                  className="hover:bg-blue-50 transition"
                >
                  <td className="p-3 border-b font-medium text-[#3E4A8A] whitespace-nowrap">
                    {f.formNumber}
                  </td>

                  <td className="p-3 border-b text-gray-700 break-words">
                    {f.description}
                  </td>

                  <td className="p-3 border-b text-center">
                    <span className="inline-block px-3 py-1 text-xs rounded bg-blue-100 text-[#3E4A8A] font-semibold">
                      {f.priority || "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE VIEW (≤md) ===== */}
      <div className="md:hidden space-y-3">
        {loading && (
          <div className="py-6 text-center bg-white rounded-lg shadow text-gray-400 text-xs">
            Loading TM Forms...
          </div>
        )}

        {!loading && forms.length === 0 && (
          <div className="py-6 text-center bg-white rounded-lg shadow text-gray-400 text-xs">
            No TM Forms found
          </div>
        )}

        {!loading &&
          forms.map((f, index) => (
            <div
              key={f._id}
              className="bg-white rounded-xl shadow border p-3 space-y-2 text-[10px] sm:text-xs"
            >
              <div className="flex justify-between">
                <span className="font-semibold text-gray-500">
                  #{index + 1}
                </span>

                <span className="px-2 py-0.5 rounded bg-blue-100 text-[#3E4A8A] font-semibold text-[9px] sm:text-xs">
                  {f.priority || "N/A"}
                </span>
              </div>

              <div className="flex justify-between gap-2">
                <span className="font-semibold whitespace-nowrap">
                  Form No:
                </span>
                <span className="text-gray-700 break-all text-right">
                  {f.formNumber}
                </span>
              </div>

              <div className="flex justify-between gap-2">
                <span className="font-semibold whitespace-nowrap">
                  Description:
                </span>
                <span className="text-gray-700 break-words text-right">
                  {f.description}
                </span>
              </div>
            </div>
          ))}
      </div>

    </div>
  );
};

export default AgentTMForms;