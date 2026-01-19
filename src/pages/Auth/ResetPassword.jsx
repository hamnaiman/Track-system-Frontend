import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/api";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!password || !confirmPassword) {
      return setError("All fields are required");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });

      setSuccess(res.data.message || "Password reset successfully");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid or expired reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#3E4A8A] to-[#2f3970] px-8 py-6 text-center">
          <img
            src="/logo.jpg"
            alt="Trade Developers & Protectors"
            className="h-10 mx-auto mb-2"
          />
          <h2 className="text-xl font-semibold text-white">
            Reset Password
          </h2>
          <p className="text-xs text-white/80 mt-1">
            Trade Developers & Protectors
          </p>
        </div>

        {/* BODY */}
        <div className="p-8">

          {success && (
            <div className="mb-4 text-sm text-green-800 bg-green-50 border border-green-200 p-3 rounded">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 text-sm text-red-800 bg-red-50 border border-red-200 p-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300
                           focus:outline-none focus:ring-2 focus:ring-[#3E4A8A]/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300
                           focus:outline-none focus:ring-2 focus:ring-[#3E4A8A]/30"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3E4A8A] hover:bg-[#2f3970]
                         text-white py-3 rounded-lg font-semibold transition
                         disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-[#3E4A8A] hover:underline">
              Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
