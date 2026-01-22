import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const TMFormEntries = () => {
  const [applications, setApplications] = useState([]);
  const [tmForms, setTMForms] = useState([]);
  const [entries, setEntries] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    tmForm: "",
    filingDate: "",
    remark: ""
  });

  const [editId, setEditId] = useState(null);

  /* ================= LOAD MASTER DATA ================= */
  useEffect(() => {
    loadMasters();
  }, []);

  const loadMasters = async () => {
    try {
      const [appsRes, formsRes] = await Promise.all([
        api.get("/applications"),
        api.get("/tm-forms")
      ]);

      setApplications(appsRes.data?.data || []);
      setTMForms(formsRes.data || []);
    } catch {
      toast.error("Failed to load data");
    }
  };

  /* ================= FETCH ENTRIES ================= */
  const fetchEntries = async () => {
    if (!selectedApp) {
      toast.warning("Select application first");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/tm-form-entries/${selectedApp}`);
      setEntries(res.data || []);
    } catch {
      toast.error("Failed to load entries");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORM ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ tmForm: "", filingDate: "", remark: "" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedApp || !form.tmForm || !form.filingDate) {
      toast.warning("All required fields must be filled");
      return;
    }

    try {
      const payload = {
        applicationId: selectedApp,
        tmForm: form.tmForm,
        filingDate: form.filingDate,
        remark: form.remark
      };

      if (editId) {
        await api.put(`/tm-form-entries/${editId}`, payload);
        toast.success("TM Form entry updated");
      } else {
        await api.post("/tm-form-entries", payload);
        toast.success("TM Form entry added");
      }

      resetForm();
      fetchEntries();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (e) => {
    setForm({
      tmForm: e.tmForm?._id,
      filingDate: e.filingDate?.slice(0, 10),
      remark: e.remark || ""
    });
    setEditId(e._id);
  };

  /* ================= DELETE (TOAST CONFIRM) ================= */
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p className="font-semibold mb-3">
            Delete this TM Form entry?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/tm-form-entries/${id}`);
                  toast.success("Entry deleted");
                  fetchEntries();
                } catch {
                  toast.error("Delete failed");
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

      {/* ================= HEADER + SELECT ================= */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow border space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#3E4A8A]">
            TM Form Entries
          </h2>
          <p className="text-sm text-gray-500">
            Maintain TM Forms filed against trademark applications
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-semibold">
              Trademark Application
            </label>
            <select
              value={selectedApp}
              onChange={(e) => setSelectedApp(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-lg bg-gray-100 border"
            >
              <option value="">Select Application</option>
              {applications.map(app => (
                <option key={app._id} value={app._id}>
                  {app.applicationNumber} — {app.trademark}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchEntries}
            className="w-full sm:w-auto bg-[#3E4A8A] text-white px-8 py-3 rounded-lg font-semibold"
          >
            View
          </button>
        </div>
      </div>

      {/* ================= FORM ================= */}
      {selectedApp && (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow border">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <select
              name="tmForm"
              value={form.tmForm}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border"
            >
              <option value="">Select TM Form</option>
              {tmForms.map(f => (
                <option key={f._id} value={f._id}>
                  {f.formNumber}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="filingDate"
              value={form.filingDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border"
            />

            <input
              name="remark"
              placeholder="Remark (optional)"
              value={form.remark}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border"
            />

            <div className="md:col-span-3 text-right">
              <button className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-lg font-semibold">
                {editId ? "Update Entry" : "Add Entry"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= DESKTOP TABLE ================= */}
      {selectedApp && (
        <div className="hidden md:block bg-white rounded-xl shadow border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-50 text-[#3E4A8A] text-left">
              <tr>
                <th className="p-3 border">TM Form</th>
                <th className="p-3 border">Filing Date</th>
                <th className="p-3 border">Remark</th>
                <th className="p-3 border text-center">Edit</th>
                <th className="p-3 border text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center">Loading...</td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No entries found
                  </td>
                </tr>
              ) : (
                entries.map(e => (
                  <tr key={e._id}>
                    <td className="p-3 border">{e.tmForm?.formNumber}</td>
                    <td className="p-3 border">{e.filingDate?.slice(0, 10)}</td>
                    <td className="p-3 border">{e.remark || "-"}</td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => handleEdit(e)}
                        className="text-blue-600 font-semibold"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => handleDelete(e._id)}
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
      )}

      {/* ================= MOBILE VIEW ================= */}
      {selectedApp && (
        <div className="md:hidden space-y-4">
          {entries.map(e => (
            <div
              key={e._id}
              className="bg-white p-4 rounded-xl shadow border space-y-2 text-sm"
            >
              <p><b>TM Form:</b> {e.tmForm?.formNumber}</p>
              <p><b>Filing Date:</b> {e.filingDate?.slice(0, 10)}</p>
              <p><b>Remark:</b> {e.remark || "-"}</p>

              <div className="flex justify-end gap-4 pt-2">
                <button
                  onClick={() => handleEdit(e)}
                  className="text-blue-600 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(e._id)}
                  className="text-red-600 font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default TMFormEntries;
