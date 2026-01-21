import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const Journal = () => {
  const [applications, setApplications] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD AGENT APPLICATIONS ================= */
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const res = await api.get("/applications");
        setApplications(res.data?.data || []);
      } catch {
        toast.error("Failed to load applications");
      }
    };

    loadApplications();
  }, []);

  /* ================= LOAD JOURNALS (FAST – PARALLEL) ================= */
  useEffect(() => {
    const loadJournals = async () => {
      setLoading(true);

      if (applications.length === 0) {
        setRows([]);
        setLoading(false);
        return;
      }

      try {
        const requests = applications.map((app) =>
          api
            .get(`/journals/${app._id}`)
            .then((res) => ({
              app,
              entries: res.data?.data?.entries || [],
            }))
            .catch(() => null) // journal not found → ignore
        );

        const results = await Promise.all(requests);

        const journalRows = [];

        results.forEach((result) => {
          if (!result) return;

          const { app, entries } = result;

          entries.forEach((e) => {
            journalRows.push({
              applicationNumber: app.applicationNumber,
              trademark: app.trademark,
              jNo: e.jNo,
              pageNo: e.pageNo,
              journalDate: e.journalDate,
              publishedDate: e.publishedDate,
              remark: e.remark,
            });
          });
        });

        setRows(journalRows);
      } catch (err) {
        toast.error("Failed to load journal records");
      } finally {
        setLoading(false);
      }
    };

    loadJournals();
  }, [applications]);

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div>
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Journal Details
        </h2>
        <p className="text-sm text-gray-500">
          Published journal entries (read-only)
        </p>
      </div>

      {/* ===== CONTENT ===== */}
      {loading ? (
        <div className="p-6 text-center text-gray-500 bg-white rounded-xl border">
          Loading journal records...
        </div>
      ) : rows.length === 0 ? (
        <div className="p-6 text-center text-gray-400 bg-white rounded-xl border">
          No journal records found
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl border overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <Th>Application #</Th>
                  <Th>Trademark</Th>
                  <Th>Journal #</Th>
                  <Th>Page #</Th>
                  <Th>Journal Date</Th>
                  <Th>Published Date</Th>
                  <Th>Remark</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((j, i) => (
                  <tr key={i} className="hover:bg-blue-50">
                    <Td bold>{j.applicationNumber}</Td>
                    <Td>{j.trademark || "—"}</Td>
                    <Td>{j.jNo || "—"}</Td>
                    <Td>{j.pageNo || "—"}</Td>
                    <Td>{j.journalDate ? new Date(j.journalDate).toLocaleDateString() : "—"}</Td>
                    <Td>{j.publishedDate ? new Date(j.publishedDate).toLocaleDateString() : "—"}</Td>
                    <Td>{j.remark || "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {rows.map((j, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border space-y-2">
                <Info label="Application #" value={j.applicationNumber} />
                <Info label="Trademark" value={j.trademark} />
                <Info label="Journal #" value={j.jNo} />
                <Info label="Page #" value={j.pageNo} />
                <Info label="Journal Date" value={j.journalDate ? new Date(j.journalDate).toLocaleDateString() : "—"} />
                <Info label="Published Date" value={j.publishedDate ? new Date(j.publishedDate).toLocaleDateString() : "—"} />
                <Info label="Remark" value={j.remark} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Journal;

/* ================= UI HELPERS ================= */
const Th = ({ children }) => (
  <th className="p-4 border-b text-left font-semibold text-gray-600 whitespace-nowrap">
    {children}
  </th>
);

const Td = ({ children, bold }) => (
  <td className={`p-4 border-b ${bold ? "font-medium text-[#3E4A8A]" : "text-gray-700"}`}>
    {children}
  </td>
);

const Info = ({ label, value }) => (
  <div>
    <span className="font-semibold text-sm">{label}: </span>
    <span className="text-gray-700 text-sm">{value || "—"}</span>
  </div>
);
