import React, { useState } from "react";
import api from "../../../api/api";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return setError("New password and confirm password do not match");
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/change-password", {
        oldPassword: currentPassword,
        newPassword,
        confirmPassword
      });

      setSuccess(res.data.message || "Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-xl">

      {/* ===== PAGE HEADER ===== */}
      <div>
        <h2 className="text-2xl font-semibold text-[#3E4A8A]">
          Change Password
        </h2>
        <p className="text-sm text-gray-500">
          Update your account password securely
        </p>
      </div>

      {/* ===== FORM CARD ===== */}
      <div className="bg-white border rounded-lg shadow-sm p-6">

        {/* ERROR */}
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-2 rounded">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* CURRENT PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4A8A]/40"
              placeholder="Enter current password"
            />
          </div>

          {/* NEW PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4A8A]/40"
              placeholder="Enter new password"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 8 characters, 1 uppercase, 1 number & 1 special character
            </p>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3E4A8A]/40"
              placeholder="Confirm new password"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3E4A8A] text-white py-2.5 rounded text-sm font-medium hover:bg-[#2f3a72] transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>

        </form>
      </div>

    </div>
  );
};

export default ChangePassword;
