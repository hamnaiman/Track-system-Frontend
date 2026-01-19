import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const ClassSetup = () => {
  const [form, setForm] = useState({
    classNumber: "",
    description: "",
  });

  const [classes, setClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===== FETCH ===== */
  const fetchClasses = async () => {
    try {
      const res = await api.get("/classes");
      setClasses(res.data || []);
    } catch {
      toast.error("Unable to load classes");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  /* ===== CHANGE ===== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ===== CREATE / UPDATE ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.classNumber || !form.description.trim()) {
      toast.warning("Class number & description are required");
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        await api.put(`/classes/${editingId}`, form);
        toast.success("Class updated successfully");
      } else {
        await api.post("/classes", form);
        toast.success("Class added successfully");
      }

      setForm({ classNumber: "", description: "" });
      setEditingId(null);
      fetchClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===== EDIT ===== */
  const handleEdit = (cls) => {
    setForm({
      classNumber: cls.classNumber,
      description: cls.description,
    });
    setEditingId(cls._id);
  };

  /* ===== DELETE ===== */
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm">
            Are you sure you want to delete this class?
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/classes/${id}`);
                  toast.success("Class deleted successfully");
                  fetchClasses();
                } catch {
                  toast.error("Delete failed");
                }
                closeToast();
              }}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Yes, Delete
            </button>

            <button
              onClick={closeToast}
              className="bg-gray-200 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* ===== FORM CARD ===== */}
      <div className="bg-white rounded-2xl shadow-md border p-8">
        <h2 className="text-2xl font-bold text-[#3E4A8A] mb-2">
          Class Setup
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Add a new class with its number and description
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="classNumber"
            value={form.classNumber}
            onChange={handleChange}
            placeholder="Class Number"
            className="w-full px-4 py-3 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              disabled={loading}
              className="bg-[#3E4A8A] hover:bg-[#2f3970]
                         text-white px-6 py-3 rounded-lg font-semibold
                         transition disabled:opacity-60"
            >
              {loading ? "Processing..." : editingId ? "Update" : "Save"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ classNumber: "", description: "" });
                }}
                className="px-6 py-3 rounded-lg border border-gray-300
                           text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ===== TABLE CARD ===== */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <h3 className="text-xl font-bold text-[#3E4A8A] mb-2">
          Classes List
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          View, edit, or delete existing classes
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-blue-50 text-[#3E4A8A]">
              <tr>
                <th className="p-3 border text-left w-16">#</th>
                <th className="p-3 border text-left w-24">Class</th>
                <th className="p-3 border text-left">Description</th>
                <th className="p-3 border text-center w-16">Edit</th>
                <th className="p-3 border text-center w-20">Delete</th>
              </tr>
            </thead>

            <tbody>
              {classes.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-4 text-gray-500"
                  >
                    No classes found
                  </td>
                </tr>
              ) : (
                classes.map((cls, index) => (
                  <tr
                    key={cls._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{cls.classNumber}</td>
                    <td className="p-3">{cls.description}</td>

                    <td
                      onClick={() => handleEdit(cls)}
                      className="p-3 text-center text-[#3E4A8A]
                                 cursor-pointer hover:underline"
                    >
                      Edit
                    </td>

                    <td
                      onClick={() => handleDelete(cls._id)}
                      className="p-3 text-center text-red-600
                                 cursor-pointer hover:underline"
                    >
                      Delete
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ClassSetup;
