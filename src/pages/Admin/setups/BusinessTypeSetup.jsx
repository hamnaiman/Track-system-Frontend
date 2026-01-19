import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const BusinessTypeSetup = () => {
  const [name, setName] = useState("");
  const [businessTypes, setBusinessTypes] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===== FETCH ===== */
  const fetchBusinessTypes = async () => {
    try {
      const res = await api.get("/business-types");
      setBusinessTypes(res.data || []);
    } catch {
      toast.error("Failed to fetch business types");
    }
  };

  useEffect(() => {
    fetchBusinessTypes();
  }, []);

  /* ===== CREATE / UPDATE ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.warning("Business type name is required");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        await api.put(`/business-types/${editId}`, { name });
        toast.success("Business type updated successfully");
      } else {
        await api.post("/business-types", { name });
        toast.success("Business type added successfully");
      }

      setName("");
      setEditId(null);
      fetchBusinessTypes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===== EDIT ===== */
  const handleEdit = (type) => {
    setName(type.name);
    setEditId(type._id);
  };

  /* ===== DELETE ===== */
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm">
            Are you sure you want to delete this business type?
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/business-types/${id}`);
                  toast.success("Business type deleted successfully");
                  fetchBusinessTypes();
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
          Business Type Setup
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Add a new business type to categorize businesses effectively
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            type="text"
            placeholder="Enter business type name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full sm:w-80 px-4 py-3 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <button
            disabled={loading}
            className="bg-[#3E4A8A] hover:bg-[#2f3970]
                       text-white px-6 py-3 rounded-lg font-semibold
                       transition disabled:opacity-60"
          >
            {loading ? "Processing..." : editId ? "Update" : "Save"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setName("");
              }}
              className="px-6 py-3 rounded-lg border border-gray-300
                         text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* ===== TABLE CARD ===== */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <h3 className="text-xl font-bold text-[#3E4A8A] mb-2">
          Business Types List
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          View, edit, or delete existing business types
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-blue-50 text-[#3E4A8A]">
              <tr>
                <th className="p-3 border text-left">#</th>
                <th className="p-3 border text-left">Business Type Name</th>
                <th className="p-3 border text-center">Edit</th>
                <th className="p-3 border text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {businessTypes.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-4 text-gray-500"
                  >
                    No business types found
                  </td>
                </tr>
              ) : (
                businessTypes.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{item.name}</td>

                    <td
                      onClick={() => handleEdit(item)}
                      className="p-3 text-center text-[#3E4A8A]
                                 cursor-pointer hover:underline"
                    >
                      Edit
                    </td>

                    <td
                      onClick={() => handleDelete(item._id)}
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

export default BusinessTypeSetup;
