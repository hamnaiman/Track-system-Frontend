import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const RenewalDetails = () => {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [appData, setAppData] = useState(null);

  const [renewedUpto, setRenewedUpto] = useState("");
  const [remark, setRemark] = useState("");

  const [renewal, setRenewal] = useState({ entries: [] });

  /* ================= SEARCH APPLICATION ================= */
  const searchApplication = async () => {
    if (!applicationNumber.trim()) {
      toast.warning("Enter Application Number");
      return;
    }

    try {
      const res = await api.get(
        `/applications?applicationNumber=${applicationNumber}`
      );

      if (!res.data.data.length) {
        toast.error("Application not found");
        return;
      }

      const app = res.data.data[0];
      setAppData(app);
      setApplicationId(app._id);
      loadRenewals(app._id);

      toast.success("Application Loaded");
    } catch {
      toast.error("Search Failed");
    }
  };

  /* ================= LOAD RENEWALS ================= */
  const loadRenewals = async (appId) => {
    try {
      const res = await api.get(`/renewals/${appId}`);
      setRenewal(res.data || { entries: [] });
    } catch {
      setRenewal({ entries: [] });
    }
  };

  /* ================= ADD ENTRY ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!applicationId || !renewedUpto) {
      toast.warning("Renewal date is required");
      return;
    }

    try {
      await api.post("/renewals", {
        applicationId,
        renewedUpto,
        remark,
      });

      toast.success("Renewal Entry Added");

      setRenewedUpto("");
      setRemark("");
      loadRenewals(applicationId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Save Failed");
    }
  };

  /* ================= DELETE ENTRY ================= */
  const deleteEntry = (renewalId, entryId) => {
    toast.info(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="font-semibold text-sm">
            Delete this renewal entry?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                try {
                  await api.delete(
                    `/renewals/${renewalId}/entry/${entryId}`
                  );
                  toast.success("Entry Deleted");
                  loadRenewals(applicationId);
                } catch {
                  toast.error("Delete Failed");
                }
                closeToast();
              }}
              className="bg-red-600 text-white px-4 py-1 rounded"
            >
              Yes
            </button>

            <button
              onClick={closeToast}
              className="bg-gray-300 px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-8">

      {/* ================= HEADER + SEARCH ================= */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow border space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#3E4A8A]">
            Renewal Details
          </h2>
          <p className="text-sm text-gray-500">
            Manage trademark renewal history
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            value={applicationNumber}
            onChange={(e) => setApplicationNumber(e.target.value)}
            placeholder="Enter Application Number"
            className="w-full sm:w-80 px-4 py-3 rounded-lg bg-gray-100 border
                       focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <button
            onClick={searchApplication}
            className="w-full sm:w-auto bg-[#3E4A8A] hover:bg-[#2f3970]
                       text-white px-8 py-3 rounded-lg font-semibold"
          >
            Search
          </button>
        </div>
      </div>

      {/* ================= APPLICATION INFO ================= */}
      {appData && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow border
                        grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Info label="Application #" value={appData.applicationNumber} />
          <Info label="File #" value={appData.fileNumber} />
          <Info label="Trademark" value={appData.trademark} />
          <Info label="Goods" value={appData.goods} />
        </div>
      )}

      {/* ================= FORM ================= */}
      {appData && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow border">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <Input
              type="date"
              value={renewedUpto}
              onChange={(e) => setRenewedUpto(e.target.value)}
              required
            />

            <Input
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Remark"
            />

            <div className="md:col-span-2 text-right">
              <button
                className="w-full sm:w-auto bg-[#3E4A8A] hover:bg-[#2f3970]
                           text-white px-8 py-3 rounded-lg font-semibold"
              >
                Save Renewal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= TABLE (DESKTOP) ================= */}
      <div className="hidden md:block bg-white rounded-2xl shadow border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-50 text-[#3E4A8A] text-left">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Renewed Upto</th>
              <th className="p-3 border">Remark</th>
              <th className="p-3 border text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {renewal.entries?.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-6 text-gray-500">
                  No renewal records found
                </td>
              </tr>
            ) : (
              renewal.entries.map((item, i) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{i + 1}</td>
                  <td className="p-3 border">
                    {new Date(item.renewedUpto).toLocaleDateString()}
                  </td>
                  <td className="p-3 border">{item.remark || "-"}</td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() =>
                        deleteEntry(renewal._id, item._id)
                      }
                      className="text-red-600 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="md:hidden space-y-4">
        {renewal.entries?.map((item, i) => (
          <div
            key={item._id}
            className="bg-white p-4 rounded-xl shadow border space-y-2 text-sm"
          >
            <p><b>#:</b> {i + 1}</p>
            <p>
              <b>Renewed Upto:</b>{" "}
              {new Date(item.renewedUpto).toLocaleDateString()}
            </p>
            <p><b>Remark:</b> {item.remark || "-"}</p>

            <button
              onClick={() => deleteEntry(renewal._id, item._id)}
              className="text-red-600 font-semibold pt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default RenewalDetails;

/* ================= COMPONENTS ================= */
const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full px-4 py-3 rounded-lg bg-gray-100 border
                focus:outline-none focus:ring-2 focus:ring-blue-200 ${className}`}
  />
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800">{value || "-"}</p>
  </div>
);