import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const FileStatusSetup = () => {
  const [description, setDescription] = useState("");
  const [fileStatuses, setFileStatuses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH FILE STATUSES ================= */
  const fetchFileStatuses = async () => {
    try {
      const res = await api.get("/file-statuses");
      setFileStatuses(res.data || []);
    } catch {
      toast.error("Failed to load file statuses");
    }
  };

  useEffect(() => {
    fetchFileStatuses();
  }, []);

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.warning("Status description is required");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        await api.put(`/file-statuses/${editId}`, { description });
        toast.success("File Status Updated Successfully");
      } else {
        await api.post("/file-statuses", { description });
        toast.success("File Status Added Successfully");
      }

      setDescription("");
      setEditId(null);
      fetchFileStatuses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (status) => {
    setDescription(status.description);
    setEditId(status._id);
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm">
            Are you sure you want to delete this File Status?
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/file-statuses/${id}`);
                  toast.success("File Status Deleted Successfully");
                  fetchFileStatuses();
                } catch {
                  toast.error("Delete failed");
                }
                closeToast();
              }}
              className="bg-red-600 text-white px-4 py-1 rounded"
            >
              Yes, Delete
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
      { autoClose: false, closeOnClick: false }
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* ================= HEADER + FORM CARD ================= */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <h2 className="text-2xl font-bold text-[#3E4A8A] mb-1">
          File Status Setup
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Manage application file status workflow
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4"
        >
          <input
            type="text"
            placeholder="Enter Status Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full sm:w-80 px-4 py-3 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          <div className="flex gap-3">
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
                  setDescription("");
                }}
                className="bg-gray-400 text-white px-6 py-3 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <h3 className="text-xl font-bold text-[#3E4A8A] mb-1">
          File Status List
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          View, edit, or delete existing file statuses
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-blue-50 text-[#3E4A8A]">
              <tr>
                <Th className="w-16">S.No</Th>
                <Th>Status Description</Th>
                <Th className="w-20 text-center">Edit</Th>
                <Th className="w-24 text-center">Delete</Th>
              </tr>
            </thead>

            <tbody>
              {fileStatuses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">
                    No File Status Found
                  </td>
                </tr>
              ) : (
                fileStatuses.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <Td>{index + 1}</Td>
                    <Td>{item.description}</Td>
                    <Td
                      onClick={() => handleEdit(item)}
                      className="text-center text-[#3E4A8A] cursor-pointer font-medium"
                    >
                      Edit
                    </Td>
                    <Td
                      onClick={() => handleDelete(item._id)}
                      className="text-center text-red-600 cursor-pointer font-medium"
                    >
                      Delete
                    </Td>
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

export default FileStatusSetup;

/* ================= UI HELPERS ================= */

const Th = ({ children, className = "" }) => (
  <th className={`p-3 border text-left font-bold ${className}`}>
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`p-3 border ${className}`}>{children}</td>
);
