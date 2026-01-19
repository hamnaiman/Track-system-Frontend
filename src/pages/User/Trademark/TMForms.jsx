import React, { useEffect, useState } from "react";
import api from "../../../api/api";

const TMForms = () => {
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
      console.error("Failed to load TM Forms", err);
      setError("Failed to load TM Forms");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          TM Forms
        </h2>
        <p className="text-sm text-gray-500">
          View available Trademark forms along with their priority level
        </p>
      </div>

      {/* ===== ERROR ===== */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* ===== TABLE CARD ===== */}
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">

        {/* TABLE HEADER */}
        <div className="px-4 py-3 border-b bg-gray-50 font-medium text-gray-700">
          Trademark Forms List
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-blue-50 text-[#3E4A8A]">
  <tr>
    <th className="border px-4 py-2 text-left font-semibold whitespace-nowrap">
      Form Number
    </th>
    <th className="border px-4 py-2 text-left font-semibold">
      Description
    </th>
    <th className="border px-4 py-2 text-center font-semibold whitespace-nowrap">
      Priority
    </th>
  </tr>
</thead>


            <tbody>
              {loading && (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    Loading TM Forms...
                  </td>
                </tr>
              )}

              {!loading && forms.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    No TM Forms available
                  </td>
                </tr>
              )}

              {!loading &&
                forms.map((form) => (
                  <tr
                    key={form._id}
                    className="hover:bg-blue-50 transition"
                  >
                    <td className="border px-4 py-2 font-medium text-gray-800 whitespace-nowrap">
                      {form.formNumber}
                    </td>

                    <td className="border px-4 py-2 text-gray-700">
                      {form.description}
                    </td>

                    <td className="border px-4 py-2 text-center">
                      <span className="inline-block px-3 py-1 text-xs rounded bg-blue-100 text-[#3E4A8A] font-semibold">
                        {form.priority}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default TMForms;
