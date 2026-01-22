import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [customerCode, setCustomerCode] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ NEW

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        customerCode,
        userId,
        password,
      });

      if (res.data.otpRequired) {
        localStorage.setItem("otpUserId", res.data.userId);
        toast.info("OTP sent to your registered contact");
        navigate("/send-otp");
        return;
      }

      const { user, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role?.toLowerCase());
      localStorage.setItem("userName", user.fullName);
      localStorage.setItem("authUser", JSON.stringify(user));

      toast.success(`Welcome ${user.fullName}`);

      const role = user.role?.toLowerCase();
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "user") navigate("/user/dashboard");
      else if (role === "agent") navigate("/agent/dashboard");
      else toast.error("Unknown role");

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-[#F4F6F8] px-4">

      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-xl border p-5 sm:p-6">

        {/* HEADER */}
        <div className="text-center mb-6">
          <img
            src="/logo.jpg"
            alt="Trade Developers & Protectors"
            className="h-11 sm:h-13 mx-auto mb-3"
          />

          <h2 className="text-lg sm:text-xl font-bold text-[#3E4A8A]">
            TRADE DEVELOPERS & PROTECTORS
          </h2>

          <p className="text-xs sm:text-sm text-green-600 font-medium mt-1">
            Advisors, Consultants & Attorneys
          </p>

          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
            Trademark | Madrid System | Copyright | Patent | Design
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-600">
              Customer Code
            </label>
            <input
              type="text"
              value={customerCode}
              onChange={(e) => setCustomerCode(e.target.value)}
              className="mt-1 w-full px-4 py-2.5 rounded-lg bg-gray-100 border
                         focus:outline-none focus:ring-2 focus:ring-[#3E4A8A]/30"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              User ID
            </label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 w-full px-4 py-2.5 rounded-lg bg-gray-100 border
                         focus:outline-none focus:ring-2 focus:ring-[#3E4A8A]/30"
              required
            />
          </div>

          {/* ===== PASSWORD WITH SHOW/HIDE ===== */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>

            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-12 rounded-lg bg-gray-100 border
                           focus:outline-none focus:ring-2 focus:ring-[#3E4A8A]/30"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center
                           text-sm text-gray-500 hover:text-[#3E4A8A]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-[#3E4A8A] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#3E4A8A] hover:bg-[#2f3970]
                       text-white py-2.5 rounded-lg font-semibold transition"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
