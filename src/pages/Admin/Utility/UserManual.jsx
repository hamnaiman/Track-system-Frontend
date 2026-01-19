import { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const UserManual = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      toast.error("Only PDF files allowed");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warning("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("manual", file);

    try {
      setLoading(true);
      await api.post("/documents/admin/user-manual", formData);
      toast.success("User manual uploaded successfully");
      setFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white border rounded-2xl shadow-lg p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#3E4A8A]">
            User Manual Setup
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload the official user manual across the system
          </p>
        </div>

        {/* FILE UPLOAD */}
        <div className="space-y-5">

          <div>
            <label className="block text-sm font-semibold text-[#3E4A8A] mb-2">
              Upload User Manual (PDF)
            </label>

            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-3 rounded-lg border bg-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            <div className="text-xs text-gray-500 mt-2 space-y-1">
              <p>• Only PDF files allowed</p>
              <p>• Maximum size: 5MB</p>
              <p>• New upload will replace existing manual</p>
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-[#3E4A8A] hover:bg-[#2f3970]
                       text-white py-3 rounded-lg font-semibold transition disabled:opacity-70"
          >
            {loading ? "Uploading..." : "Upload Manual"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default UserManual;
