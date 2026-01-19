import { useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setSuccess(res.data.message || "Reset link sent to your registered email.");
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6F8] px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border p-8">

        {/* LOGO + TITLE */}
        <div className="text-center mb-6">
          <img
            src="/logo.jpg"
            alt="Trade Developers & Protectors Logo"
            className="h-12 mx-auto mb-3"
          />
          <h2 className="text-2xl font-bold text-[#3E4A8A]">
            Forgot Password
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your registered email to reset your TDP account
          </p>
        </div>

        {/* SUCCESS / ERROR */}
        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-[#3E4A8A]/30"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3E4A8A] hover:bg-[#2f3970]
                       text-white py-3 rounded-lg font-semibold transition
                       disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* BACK TO LOGIN */}
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-[#3E4A8A] hover:underline"
          >
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}
