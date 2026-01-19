import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const LogoSetup = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [reload, setReload] = useState(Date.now());
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = api.defaults.baseURL || "";

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.warning("Please select a logo file");
      return;
    }

    const formData = new FormData();
    formData.append("logo", file);

    try {
      setLoading(true);
      const res = await api.post("/logo/upload", formData);
      toast.success(res.data.message || "Logo updated successfully");

      setFile(null);
      setPreview(null);
      setReload(Date.now()); // reload saved logo
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white border rounded-2xl shadow-lg p-6 sm:p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#3E4A8A]">
            Logo Setup
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Upload your organization logo used across all reports
          </p>
        </div>

        {/* LOGO PREVIEW */}
        <div className="flex justify-center mb-6">
          <div className="w-[230px] h-[130px] border rounded-xl bg-gray-50 flex items-center justify-center">
            <img
              src={
                preview ||
                `${API_BASE_URL}/logo?ts=${reload}`
              }
              alt="Company Logo"
              className="w-[210px] h-[110px] object-contain"
            />
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            className="w-full px-4 py-3 rounded-lg border bg-gray-100 text-sm"
          />

          <p className="text-xs text-gray-500 text-center">
            Required size: <b>210 × 110 pixels</b>
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#3E4A8A] hover:bg-[#2f3a6d] text-white"
            }`}
          >
            {loading ? "Uploading..." : "Update Logo"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LogoSetup;
