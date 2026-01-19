import { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const RenewalReport = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [applicant, setApplicant] = useState("");

  const [customers, setCustomers] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD CLIENTS ================= */
  useEffect(() => {
    api
      .get("/customers")
      .then((res) => setCustomers(res.data?.data || []))
      .catch(() => toast.error("Failed to load clients"));
  }, []);

  /* ================= GENERATE REPORT ================= */
  const generateReport = async () => {
    if (!fromDate || !toDate) {
      toast.warning("Renewal date range is required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/reports/renewals", {
        fromDate,
        toDate,
        applicant,
      });

      const data = res.data?.data || [];

      // 🔥 FLATTEN RENEWAL ENTRIES (BACKEND ALIGNED)
      const flattened = data.flatMap((r) =>
        r.entries.map((en) => ({
          applicationNumber: r.application?.applicationNumber,
          trademark: r.application?.trademark,
          client: r.application?.client,
          renewedUpto: en.renewedUpto,
          remark: en.remark,
        }))
      );

      setRows(flattened);
      toast.success("Renewal report generated");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to generate renewal report"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS BADGE ================= */
  const getStatus = (date) => {
    if (!date) return { label: "—", cls: "bg-gray-100 text-gray-600" };

    const today = new Date();
    const d = new Date(date);
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return { label: "Expired", cls: "bg-red-100 text-red-700" };
    if (diff <= 90) return { label: "Due Soon", cls: "bg-yellow-100 text-yellow-700" };
    return { label: "Active", cls: "bg-green-100 text-green-700" };
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#3E4A8A]">
          TM Renewal Report
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          Trademarks approaching renewal (read-only)
        </p>
      </div>

      {/* ================= FILTER CARD ================= */}
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-600">
              Renewal From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full mt-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-100 border text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-600">
              Renewal To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full mt-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-100 border text-xs sm:text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs sm:text-sm font-semibold text-gray-600">
              Client (Optional)
            </label>
            <select
              value={applicant}
              onChange={(e) => setApplicant(e.target.value)}
              className="w-full mt-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gray-100 border text-xs sm:text-sm"
            >
              <option value="">All Clients</option>
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
            Loading renewal report...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-4 sm:p-6 text-center text-gray-400 bg-white rounded-xl shadow-sm border">
            No renewal records found
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <Th>Application #</Th>
                    <Th>Trademark</Th>
                    <Th>Client</Th>
                    <Th>Renewal Date</Th>
                    <Th>Status</Th>
                    <Th>Remark</Th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((r, i) => {
                    const status = getStatus(r.renewedUpto);

                    return (
                      <tr key={i} className="hover:bg-gray-50">
                        <Td>{r.applicationNumber || "—"}</Td>
                        <Td>{r.trademark || "—"}</Td>
                        <Td>{r.client?.customerName || "—"}</Td>
                        <Td>
                          {r.renewedUpto
                            ? new Date(r.renewedUpto).toLocaleDateString()
                            : "—"}
                        </Td>
                        <Td>
                          <span
                            className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${status.cls}`}
                          >
                            {status.label}
                          </span>
                        </Td>
                        <Td>{r.remark || "—"}</Td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-2">
              {rows.map((r, i) => {
                const status = getStatus(r.renewedUpto);
                return (
                  <div
                    key={i}
                    className="bg-gray-50 p-2 sm:p-3 rounded-lg border shadow-sm text-[10px] sm:text-xs"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold">#</span>
                      <span>{i + 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Application #</span>
                      <span>{r.applicationNumber || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Trademark</span>
                      <span>{r.trademark || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Client</span>
                      <span>{r.client?.customerName || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Renewal Date</span>
                      <span>{r.renewedUpto ? new Date(r.renewedUpto).toLocaleDateString() : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Status</span>
                      <span className={`px-1 py-0.5 rounded-full text-[10px] font-semibold ${status.cls}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Remark</span>
                      <span>{r.remark || "—"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default RenewalReport;

/* ================= UI HELPERS ================= */
const Th = ({ children }) => (
  <th className="p-2 sm:p-4 border-b text-left font-semibold text-xs sm:text-sm">
    {children}
  </th>
);

const Td = ({ children }) => (
  <td className="p-2 sm:p-4 border-b text-gray-700 text-xs sm:text-sm">
    {children}
  </td>
);