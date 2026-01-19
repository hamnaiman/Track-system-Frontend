import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const TMFormsSetup = () => {
  const [form, setForm] = useState({
    formNumber: "",
    description: "",
    priority: "",
  });

  const [tmForms, setTMForms] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchForms = async () => {
    try {
      const res = await api.get("/tm-forms");
      setTMForms(res.data || []);
    } catch {
      toast.error("Failed to load TM Forms");
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.formNumber || !form.description || !form.priority) {
      toast.warning("All fields are required");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        await api.put(`/tm-forms/${editId}`, form);
        toast.success("TM Form Updated Successfully");
      } else {
        await api.post("/tm-forms", form);
        toast.success("TM Form Added Successfully");
      }

      setForm({ formNumber: "", description: "", priority: "" });
      setEditId(null);
      fetchForms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      formNumber: item.formNumber,
      description: item.description,
      priority: item.priority,
    });
    setEditId(item._id);
  };

  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm">
            Are you sure you want to delete this TM Form?
          </p>

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/tm-forms/${id}`);
                  toast.success("TM Form Deleted Successfully");
                  fetchForms();
                } catch {
                  toast.error("Delete failed");
                }
                closeToast();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Yes, Delete
            </button>

            <button
              onClick={closeToast}
              className="bg-gray-300 px-4 py-2 rounded"
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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8">

      {/* FORM */}
      <div className="bg-white rounded-xl shadow border p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#3E4A8A]">
          TM Forms Setup
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
        >
          <input
            type="text"
            name="formNumber"
            value={form.formNumber}
            onChange={handleChange}
            placeholder="Form Number"
            className="w-full px-4 py-3 border rounded"
          />

          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-4 py-3 border rounded"
          />

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded"
          >
            <option value="">Select Priority</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-3">
            <button
              disabled={loading}
              className="w-full sm:w-auto bg-[#3E4A8A] text-white px-6 py-3 rounded"
            >
              {loading ? "Processing..." : editId ? "Update" : "Save"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ formNumber: "", description: "", priority: "" });
                }}
                className="w-full sm:w-auto bg-gray-400 text-white px-6 py-3 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ===== MOBILE CARD VIEW ===== */}
      <div className="block md:hidden space-y-4">
        {tmForms.map((item, index) => (
          <div
            key={item._id}
            className="bg-white border rounded-xl p-4 shadow"
          >
            <p className="text-sm"><b>#</b> {index + 1}</p>
            <p className="text-sm"><b>Form No:</b> {item.formNumber}</p>
            <p className="text-sm"><b>Description:</b> {item.description}</p>
            <p className="text-sm"><b>Priority:</b> {item.priority}</p>

            <div className="flex gap-4 mt-3">
              <button
                onClick={() => handleEdit(item)}
                className="text-[#3E4A8A]"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ===== TABLE VIEW (MD+) ===== */}
      <div className="hidden md:block bg-white border rounded-xl p-4 shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-50 text-[#3E4A8A]">
              <tr>
                <Th>#</Th>
                <Th>Form No</Th>
                <Th>Description</Th>
                <Th className="text-center">Priority</Th>
                <Th className="text-center">Actions</Th>
              </tr>
            </thead>

            <tbody>
              {tmForms.map((item, index) => (
                <tr key={item._id} className="border-b">
                  <Td>{index + 1}</Td>
                  <Td>{item.formNumber}</Td>
                  <Td>{item.description}</Td>
                  <Td className="text-center">{item.priority}</Td>
                  <Td className="text-center space-x-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-[#3E4A8A]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TMFormsSetup;

/* HELPERS */
const Th = ({ children, className = "" }) => (
  <th className={`p-3 border text-left ${className}`}>{children}</th>
);
const Td = ({ children, className = "" }) => (
  <td className={`p-3 border ${className}`}>{children}</td>
);