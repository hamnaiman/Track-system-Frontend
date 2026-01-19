const API_BASE = import.meta.env.VITE_API_URL;

const PrintHeader = ({ title }) => {
  return (
    <div className="border-b border-gray-300 pb-4 mb-6 flex items-center justify-between">
      {/* Company Logo */}
      <img
        src={`${API_BASE}/api/logo`}
        alt="Company Logo"
        className="h-[55px] object-contain"
      />

      {/* Dynamic Report Title */}
      <div className="text-right">
        <h1 className="text-lg font-semibold tracking-wide uppercase">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default PrintHeader;
