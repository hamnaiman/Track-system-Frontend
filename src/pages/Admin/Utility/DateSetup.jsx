import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const DateSetup = () => {
  const [dateFormat, setDateFormat] = useState("MM/dd/yyyy");
  const [loading, setLoading] = useState(false);

  const fetchDateFormat = async () => {
    try {
      const res = await api.get("/settings/date-format");
      setDateFormat(res.data.dateFormat);
    } catch {
      toast.error("Failed to load date format");
    }
  };

  useEffect(() => {
    fetchDateFormat();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await api.put("/settings/date-format", { dateFormat });
      toast.success(res.data.message || "Date format updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">

        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#3E4A8A]">
            Date Format Setup
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose how dates are displayed across the system
          </p>
        </div>

        {/* SELECT CARD */}
        <div className="border rounded-xl bg-gray-50 p-5 space-y-3">
          <label className="block text-sm font-semibold text-gray-600">
            Select Date Format
          </label>
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border bg-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="MM/dd/yyyy">MM / DD / YYYY (US Format)</option>
            <option value="dd/MM/yyyy">DD / MM / YYYY (International)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            This format will be applied to all date fields in IPMS.
          </p>
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-[#3E4A8A] hover:bg-[#2f3970]
                     text-white py-3 rounded-lg font-semibold transition
                     disabled:opacity-60"
        >
          {loading ? "Updating..." : "Update Date Format"}
        </button>
      </div>
    </div>
  );
};

export default DateSetup;
