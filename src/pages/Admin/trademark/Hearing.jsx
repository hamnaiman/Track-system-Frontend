import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const Hearing = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState("");
  const [applicationInfo, setApplicationInfo] = useState(null);
  const [hearings, setHearings] = useState([]);

  const [form, setForm] = useState({
    hearingDate: "",
    before: "",
    commentsArguments: "",
    advocateAppeared: "",
  });

  const [editId, setEditId] = useState(null);

  /* ================= LOAD APPLICATIONS ================= */
  useEffect(() => {
    api.get("/applications").then((res) => {
      setApplications(res.data.data || []);
    });
  }, []);

  /* ================= LOAD HEARINGS ================= */
  const loadHearings = async (appId) => {
    if (!appId) return;

    try {
      const res = await api.get(`/hearings/${appId}`);
      setApplicationInfo(res.data);
      setHearings(res.data.hearings || []);
    } catch {
      setApplicationInfo(null);
      setHearings([]);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= SAVE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedApp || !form.hearingDate || !form.before) {
      toast.warning("Hearing date & Before are required");
      return;
    }

    try {
      if (editId) {
        await api.put(`/hearings/entry/${editId}`, form);
        toast.success("Hearing updated");
      } else {
        await api.post("/hearings", {
          application: selectedApp,
          trademark: applicationInfo?.application?.trademark || "",
          goods:
            applicationInfo?.goods ||
            applicationInfo?.application?.goods ||
            "",
          ...form,
        });
        toast.success("Hearing added");
      }

      setForm({
        hearingDate: "",
        before: "",
        commentsArguments: "",
        advocateAppeared: "",
      });

      setEditId(null);
      loadHearings(selectedApp);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (row) => {
    setForm({
      hearingDate: row.hearingDate?.slice(0, 10),
      before: row.before || "",
      commentsArguments: row.commentsArguments || "",
      advocateAppeared: row.advocateAppeared || "",
    });
    setEditId(row._id);
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="font-semibold text-sm">Delete this hearing?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                await api.delete(`/hearings/entry/${id}`);
                toast.success("Deleted successfully");
                loadHearings(selectedApp);
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
    <div className="max-w-6xl mx-auto space-y-8">

      {/* ================= APPLICATION SELECT + HEADER ================= */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        {/* HEADING INSIDE WHITE BOX */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-[#3E4A8A]">
            Hearings Management
          </h2>
          <p className="text-sm text-gray-500">
            Add, update and manage hearing records
          </p>
        </div>

        <select
          value={selectedApp}
          onChange={(e) => {
            setSelectedApp(e.target.value);
            loadHearings(e.target.value);
          }}
          className="w-full md:w-1/2 px-4 py-3 rounded-lg bg-gray-100 border
                     focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">Search by Application</option>
          {applications.map((app) => (
            <option key={app._id} value={app._id}>
              {app.applicationNumber} — {app.trademark}
            </option>
          ))}
        </select>

        {applicationInfo && (
          <div className="mt-4 text-sm text-gray-700 space-y-1">
            <p>
              <b>Trademark:</b>{" "}
              {applicationInfo?.application?.trademark || "-"}
            </p>
            <p>
              <b>Goods:</b>{" "}
              {applicationInfo?.goods ||
                applicationInfo?.application?.goods ||
                "-"}
            </p>
          </div>
        )}
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Input type="date" name="hearingDate" value={form.hearingDate} onChange={handleChange} />
          <Input name="before" value={form.before} onChange={handleChange} placeholder="Before" />
          <Input name="commentsArguments" value={form.commentsArguments} onChange={handleChange} placeholder="Comments / Arguments" />
          <Input name="advocateAppeared" value={form.advocateAppeared} onChange={handleChange} placeholder="Advocate Appeared" />

          <div className="md:col-span-2 text-right">
            <button className="bg-[#3E4A8A] hover:bg-[#2f3970] text-white px-8 py-3 rounded-lg font-semibold">
              {editId ? "Update Hearing" : "Save Hearing"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-2xl shadow border overflow-x-auto">
        <table className="min-w-full text-sm">
    <thead className="bg-blue-50 text-[#3E4A8A] text-left">
            <tr>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Before</th>
              <th className="p-3 border">Arguments</th>
              <th className="p-3 border">Advocate</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hearings.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No hearings found
                </td>
              </tr>
            ) : (
              hearings.map((h) => (
                <tr key={h._id} className="hover:bg-gray-50">
                  <td className="p-3 border">
                    {h.hearingDate?.slice(0, 10)}
                  </td>
                  <td className="p-3 border">{h.before}</td>
                  <td className="p-3 border">{h.commentsArguments}</td>
                  <td className="p-3 border">{h.advocateAppeared}</td>
                  <td className="p-3 border text-center space-x-3">
                    <button
                      onClick={() => handleEdit(h)}
                      className="text-blue-600 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(h._id)}
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
    </div>
  );
};

export default Hearing;

/* ================= INPUT ================= */
const Input = (props) => (
  <input
    {...props}
    className="px-4 py-3 rounded-lg bg-gray-100 border
               focus:outline-none focus:ring-2 focus:ring-blue-200"
  />
);
