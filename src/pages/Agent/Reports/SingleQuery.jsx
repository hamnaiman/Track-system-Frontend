import { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const SingleQuery = () => {
  const [searchBy, setSearchBy] = useState("applicationNumber");
  const [value, setValue] = useState("");
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!value.trim()) {
      toast.error("Enter search value");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/reports/tm-single-query", {
        searchBy,
        value,
      });

      setRecord(res.data?.data || null);

      if (!res.data?.data) {
        toast.info("No record found");
      }
    } catch (err) {
      toast.error("Failed to load record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#3E4A8A]">
          Single Application Query
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Search and view individual application (read-only)
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="border rounded px-2 sm:px-3 py-2 text-xs sm:text-sm w-full sm:w-auto"
        >
          <option value="applicationNumber">Application #</option>
          <option value="fileNumber">File #</option>
          <option value="trademark">Trademark</option>
        </select>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
          className="border rounded px-2 sm:px-3 py-2 text-xs sm:text-sm flex-1 w-full"
        />

        <button
          onClick={handleSearch}
          className="bg-[#3E4A8A] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded w-full sm:w-auto text-xs sm:text-sm"
        >
          Search
        </button>
      </div>

      {/* RESULT */}
      {loading ? (
        <div className="p-4 sm:p-6 text-center text-gray-500 bg-white rounded-xl shadow-sm border">
          Loading...
        </div>
      ) : !record ? (
        <div className="p-4 sm:p-6 text-center text-gray-400 bg-white rounded-xl shadow-sm border">
          No record
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 space-y-4">

          {/* DETAILS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
            <Info label="Application #" value={record.applicationNumber} />
            <Info label="Trademark" value={record.trademark} />
            <Info label="Client" value={record.client?.customerName} />
            <Info label="Status" value={record.status?.description} />
            <Info
              label="Filing Date"
              value={record.filingDate ? new Date(record.filingDate).toLocaleDateString() : "—"}
            />
            <Info
              label="Reminder Date"
              value={record.reminderDate ? new Date(record.reminderDate).toLocaleDateString() : "—"}
            />
          </div>

          {/* REMARK */}
          <div className="text-xs sm:text-sm">
            <span className="font-semibold text-gray-600">Remark:</span>
            <p className="mt-1 text-gray-700">
              {record.remark || "—"}
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default SingleQuery;

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-[9px] sm:text-xs">{label}</p>
    <p className="font-medium text-gray-800 text-[10px] sm:text-sm">
      {value || "—"}
    </p>
  </div>
);