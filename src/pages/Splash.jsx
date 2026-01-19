import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (token && role) {
        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "user") navigate("/user/dashboard");
        else if (role === "agent") navigate("/agent/dashboard");
        else navigate("/login");
      } else {
        navigate("/login");
      }
    }, 3000); // ⏱ 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F4F6F8] animate-fadeIn px-4 text-center">
      
      {/* Logo */}
      <img
        src="/logo.jpg"
        alt="Trade Developers & Protectors"
        className="h-20 sm:h-24 mb-4"
      />

      {/* Company Name */}
      <h1 className="text-xl sm:text-2xl font-bold text-[#3E4A8A]">
        Trade Developers & Protectors
      </h1>

      {/* Tagline */}
      <p className="text-xs sm:text-sm text-gray-600 mt-2">
        Advisors, Consultants & Attorneys
      </p>

      <p className="text-xs sm:text-sm text-gray-500 mt-1">
        Trademark | Madrid System | Copyright | Patent | Design
      </p>

      {/* Spinner */}
      <div className="mt-8 w-8 h-8 border-2 border-[#3E4A8A] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Splash;
