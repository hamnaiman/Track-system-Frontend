import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const ApplicationDetails = () => {
  const [form, setForm] = useState({
    applicationNumber: "",
    fileNumber: "",
    dateOfFiling: "",
    takeOverDate: "",
    periodOfUse: "",
    wordOrLabel: "Word",
    classes: [],
    trademark: "",
    goods: "",
    client: "",
    showCauseReceived: "No",
    conflictingTrademark: "",
    tmNumber: "",
    status: "",
    reminderDate: "",
    reminderRemark: ""
  });

  const [applications, setApplications] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [editId, setEditId] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchApplications();
    fetchCustomers();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications");
      setApplications(res.data.data || []);
    } catch {
      toast.error("Failed to load applications");
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get("/customers");
      setCustomers(res.data.data || []);
    } catch {
      toast.error("Failed to load customers");
    }
  };

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleClass = (num) => {
    setForm((prev) => ({
      ...prev,
      classes: prev.classes.includes(num)
        ? prev.classes.filter((c) => c !== num)
        : [...prev.classes, num]
    }));
  };

  /* ================= SAVE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.classes.length === 0) {
      toast.error("Select at least one class");
      return;
    }

    if (!form.client) {
      toast.error("Client is required");
      return;
    }

    const payload = { ...form };
    if (!payload.status) delete payload.status;
    if (!payload.takeOverDate) delete payload.takeOverDate;
    if (!payload.reminderDate) delete payload.reminderDate;

    try {
      if (editId) {
        await api.put(`/applications/${editId}`, payload);
        toast.success("Application Updated");
      } else {
        await api.post("/applications", payload);
        toast.success("Application Saved");
      }

      resetForm();
      fetchApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Application Failed");
    }
  };

  const resetForm = () => {
    setForm({
      applicationNumber: "",
      fileNumber: "",
      dateOfFiling: "",
      takeOverDate: "",
      periodOfUse: "",
      wordOrLabel: "Word",
      classes: [],
      trademark: "",
      goods: "",
      client: "",
      showCauseReceived: "No",
      conflictingTrademark: "",
      tmNumber: "",
      status: "",
      reminderDate: "",
      reminderRemark: ""
    });
    setEditId(null);
  };

  /* ================= EDIT ================= */
  const handleEdit = (app) => {
    setForm({
      ...app,
      client: app.client?._id || "",
      status: app.status?._id || ""
    });
    setEditId(app._id);
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p className="font-semibold mb-2">Delete this application?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                await api.delete(`/applications/${id}`);
                toast.success("Deleted Successfully");
                fetchApplications();
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

  /* ================= UI ================= */
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-8">

      {/* ===== FORM CARD ===== */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md border p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* ===== HEADING INSIDE WHITE BOX ===== */}
        <div className="md:col-span-2 mb-2">
          <h2 className="text-2xl font-bold text-[#3E4A8A]">
            Application Details
          </h2>
          <p className="text-sm text-gray-500">
            Manage trademark applications
          </p>
        </div>

        <Input name="applicationNumber" value={form.applicationNumber} onChange={handleChange} placeholder="Application Number" required />
        <Input name="fileNumber" value={form.fileNumber} onChange={handleChange} placeholder="File Number" required />
        <Input type="date" name="dateOfFiling" value={form.dateOfFiling} onChange={handleChange} required />
        <Input type="date" name="takeOverDate" value={form.takeOverDate} onChange={handleChange} />

        <Input name="periodOfUse" value={form.periodOfUse} onChange={handleChange} placeholder="Period of Use" />

        <select name="wordOrLabel" value={form.wordOrLabel} onChange={handleChange} className="input">
          <option value="Word">Word</option>
          <option value="Label">Label</option>
        </select>

        {/* ===== CLASSES ===== */}
        <div className="md:col-span-2">
          <p className="text-sm font-semibold text-gray-600 mb-2">Classes</p>
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 max-h-32 overflow-y-auto border rounded p-2">
            {[...Array(45)].map((_, i) => {
              const num = i + 1;
              return (
                <label key={num} className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={form.classes.includes(num)}
                    onChange={() => toggleClass(num)}
                  />
                  {num}
                </label>
              );
            })}
          </div>
        </div>

        <Input name="trademark" value={form.trademark} onChange={handleChange} placeholder="Trademark" required />
        <textarea name="goods" value={form.goods} onChange={handleChange} placeholder="Goods" className="input md:col-span-2" />

        <select name="client" value={form.client} onChange={handleChange} className="input" required>
          <option value="">Select Client</option>
          {customers.map(c => (
            <option key={c._id} value={c._id}>{c.customerName}</option>
          ))}
        </select>

        <select name="showCauseReceived" value={form.showCauseReceived} onChange={handleChange} className="input">
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>

        <Input name="conflictingTrademark" value={form.conflictingTrademark} onChange={handleChange} placeholder="Conflicting Trademark" />
        <Input name="tmNumber" value={form.tmNumber} onChange={handleChange} placeholder="TM Number" />
        <Input type="date" name="reminderDate" value={form.reminderDate} onChange={handleChange} />
        <Input name="reminderRemark" value={form.reminderRemark} onChange={handleChange} placeholder="Reminder Remark" />

        <div className="md:col-span-2 text-right pt-4">
          <button className="bg-[#3E4A8A] text-white px-8 py-2 rounded-lg">
            {editId ? "Update" : "Save"}
          </button>
        </div>
      </form>

      {/* ===== TABLE DESKTOP ===== */}
      <div className="hidden md:block bg-white rounded-2xl shadow-md border p-6">
        <table className="w-full text-sm">
          <thead className="bg-blue-50 text-[#3E4A8A]">
            <tr>
              <Th>App #</Th>
              <Th>Trademark</Th>
              <Th>Client</Th>
              <Th>Edit</Th>
              <Th>Delete</Th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id} className="border-b">
                <Td>{app.applicationNumber}</Td>
                <Td>{app.trademark}</Td>
                <Td>{app.client?.customerName}</Td>
                <Td className="text-blue-600 cursor-pointer" onClick={() => handleEdit(app)}>Edit</Td>
                <Td className="text-red-600 cursor-pointer" onClick={() => handleDelete(app._id)}>Delete</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== MOBILE CARDS ===== */}
      <div className="md:hidden space-y-3">
        {applications.map(app => (
          <div key={app._id} className="bg-white border rounded-xl p-4 shadow-sm">
            <p className="font-semibold">{app.trademark}</p>
            <p className="text-sm text-gray-600">App #: {app.applicationNumber}</p>
            <p className="text-sm text-gray-600">Client: {app.client?.customerName}</p>

            <div className="flex gap-4 mt-2 text-sm">
              <button className="text-blue-600" onClick={() => handleEdit(app)}>Edit</button>
              <button className="text-red-600" onClick={() => handleDelete(app._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT STYLE */}
      <style>
        {`
          .input {
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-size: 14px;
          }
        `}
      </style>
    </div>
  );
};

export default ApplicationDetails;

/* ===== HELPERS ===== */
const Input = (props) => <input {...props} className="input" />;
const Th = ({ children }) => <th className="p-3 text-left font-bold">{children}</th>;
const Td = ({ children, className = "" }) => <td className={`p-3 ${className}`}>{children}</td>;
