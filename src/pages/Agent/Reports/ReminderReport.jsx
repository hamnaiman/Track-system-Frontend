import { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const TMReminderReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applicant, setApplicant] = useState("all");

  const [customers, setCustomers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD CUSTOMERS ================= */
  useEffect(() => {
    api
      .get("/customers")
      .then((res) => {
        setCustomers(res.data?.data || []);
      })
      .catch(() => toast.error("Failed to load clients"));
  }, []);

  /* ================= GENERATE REPORT ================= */
  const generateReport = async () => {
    if (!startDate || !endDate) {
      toast.warning("Reminder date range is required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/reports/reminders", {
        fromDate: startDate,
        toDate: endDate,
        applicant,
      });

      setResults(res.data?.data || []);
      toast.success("Reminder report generated");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to generate reminder report"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-2xl sm:text-2xl font-bold text-[#3E4A8A]">
          TM Reminder Report
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Reminder-based follow-up report (read-only)
        </p>
      </div>

      {/* ================= FILTER CARD ================= */}
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-600">
              Reminder Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full mt-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-100 border
                         focus:outline-none focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-600">
              Reminder End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full mt-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-100 border
                         focus:outline-none focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-600">
              Client (Optional)
            </label>
            <select
              value={applicant}
              onChange={(e) => setApplicant(e.target.value)}
              className="w-full mt-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-100 border
                         focus:outline-none focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm"
            >
              <option value="all">All Clients</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.customerName}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 text-right mt-2">
            <button
              onClick={generateReport}
              disabled={loading}
              className="bg-[#3E4A8A] hover:bg-[#2f3970]
                         text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold
                         disabled:opacity-60 text-xs sm:text-sm w-full md:w-auto"
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= RESULTS ================= */}
      <div className="space-y-2">

        {loading ? (
          <div className="p-4 sm:p-6 text-center text-gray-500 bg-white rounded-xl shadow-sm border">
            Loading reminders...
          </div>
        ) : results.length === 0 ? (
          <div className="p-4 sm:p-6 text-center text-gray-400 bg-white rounded-xl shadow-sm border">
            No reminders found
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <Th>#</Th>
                    <Th>Application #</Th>
                    <Th>Trademark</Th>
                    <Th>Client</Th>
                    <Th>Reminder Date</Th>
                    <Th>Remark</Th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((app, i) => (
                    <tr key={app._id} className="hover:bg-gray-50">
                      <Td>{i + 1}</Td>
                      <Td>{app.applicationNumber}</Td>
                      <Td>{app.trademark || "—"}</Td>
                      <Td>{app.client?.customerName || "—"}</Td>
                      <Td>
                        {app.reminderDate
                          ? new Date(app.reminderDate).toLocaleDateString()
                          : "—"}
                      </Td>
                      <Td>{app.reminderRemark || "—"}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-2">
              {results.map((app, i) => (
                <div
                  key={app._id}
                  className="bg-gray-50 p-2 sm:p-3 rounded-lg border shadow-sm text-[10px] sm:text-xs"
                >
                  <div className="flex justify-between"><span className="font-semibold">#:</span> <span>{i + 1}</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Application #:</span> <span>{app.applicationNumber}</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Trademark:</span> <span>{app.trademark || "—"}</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Client:</span> <span>{app.client?.customerName || "—"}</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Reminder Date:</span> <span>{app.reminderDate ? new Date(app.reminderDate).toLocaleDateString() : "—"}</span></div>
                  <div className="flex justify-between"><span className="font-semibold">Remark:</span> <span>{app.reminderRemark || "—"}</span></div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default TMReminderReport;

/* ================= UI HELPERS ================= */
const Th = ({ children }) => (
  <th className="p-2 sm:p-3 border-b text-left font-semibold text-xs sm:text-sm">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="p-2 sm:p-3 border-b text-gray-700 text-xs sm:text-sm">
    {children}
  </td>
);