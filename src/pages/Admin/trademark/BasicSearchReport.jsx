import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const BasicSearchReport = () => {
  const [filters, setFilters] = useState({
    searchBy: "DateOfFiling",
    startDate: "",
    endDate: "",
    trademark: "",
    applicant: "",
    applicationNo: "",
    classFrom: "",
    classTo: "",
    reportType: "summary",
  });

  const [customers, setCustomers] = useState([]);
  const [result, setResult] = useState([]);

  useEffect(() => {
    api
      .get("/customers")
      .then((res) => setCustomers(res.data.data || []))
      .catch(() => toast.error("Failed to load applicants"));
  }, []);

  const updateField = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const search = async () => {
    try {
      const res = await api.post("/reports/basic-search", filters);
      const dataArray = Array.isArray(res.data) ? res.data : res.data.data || [];
      setResult(dataArray);

      dataArray.length === 0
        ? toast.info("No records found")
        : toast.success(`Report generated (${dataArray.length})`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Search failed");
    }
  };

  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="font-semibold text-sm">Delete this application?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/applications/${id}`);
                  toast.success("Deleted successfully");
                  setResult(result.filter((r) => r._id !== id));
                } catch {
                  toast.error("Delete failed");
                }
                closeToast();
              }}
              className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  const handleEdit = (id) => {
    window.location.href = `/admin/application-details?edit=${id}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">

      {/* HEADER INSIDE WHITE CARD */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        <h2 className="text-2xl font-bold text-[#3E4A8A] mb-2">TM Basic Search Report</h2>
        <p className="text-sm text-gray-500 mb-6">Search trademark applications using filters</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Search By */}
          <Select name="searchBy" onChange={updateField}>
            <option value="DateOfFiling">Date Of Filing</option>
            <option value="ApplicationNo">Application No</option>
          </Select>

          {/* Dates always stacked vertically */}
          <div className="flex flex-col gap-4 md:col-span-2">
            <span className="flex flex-col gap-2 text-sm sm:text-base w-full">
              <span className="font-medium">Starting Date:</span>
              <input
                type="date"
                name="startDate"
                onChange={updateField}
                className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </span>

            <span className="flex flex-col gap-2 text-sm sm:text-base w-full">
              <span className="font-medium">End Date:</span>
              <input
                type="date"
                name="endDate"
                onChange={updateField}
                className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </span>
          </div>

          {/* Other Inputs */}
          <Input name="trademark" placeholder="Trademark" onChange={updateField} />

          <Select name="applicant" onChange={updateField}>
            <option value="">Select Applicant</option>
            {customers.map((c) => (
              <option key={c._id} value={c._id}>{c.customerName}</option>
            ))}
          </Select>

          <Input name="applicationNo" placeholder="Application No" onChange={updateField} />
          <Input name="classFrom" placeholder="Class From" type="number" onChange={updateField} />
          <Input name="classTo" placeholder="Class To" type="number" onChange={updateField} />

          {/* Report Type Radios */}
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-2">
            <label className="flex gap-2 text-sm items-center">
              <input type="radio" name="reportType" value="summary" defaultChecked onChange={updateField} />
              Summary
            </label>
            <label className="flex gap-2 text-sm items-center">
              <input type="radio" name="reportType" value="details" onChange={updateField} />
              Details
            </label>
          </div>

          <button
            onClick={search}
            className="md:col-span-2 bg-[#3E4A8A] text-white py-3 rounded-lg font-semibold hover:bg-[#2f3970] transition"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* RESULTS */}
      <div className="space-y-4">
        {result.map((item, index) => (
          <div key={item._id || index} className="bg-white border rounded-2xl shadow-sm p-5 hover:shadow-md transition">
            <div className="flex flex-col md:flex-row justify-between gap-3">
              <div>
                <h3 className="font-bold text-lg text-[#3E4A8A]">{item.trademark || item.application?.trademark || "-"}</h3>
                <p className="text-sm text-gray-600">
                  Application #: {item.applicationNumber || item.application?.applicationNumber || "-"}
                </p>
                <p className="text-sm">
                  Applicant: {item.client?.customerName || item.application?.client?.customerName || "-"}
                </p>
                <p className="text-sm">
                  Goods: {item.goods || item.application?.goods || "-"}
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => handleEdit(item._id)} className="px-4 py-1 bg-blue-100 rounded hover:bg-blue-200 transition">
                  Edit
                </button>
                <button onClick={() => handleDelete(item._id)} className="px-4 py-1 bg-red-100 rounded text-red-600 hover:bg-red-200 transition">
                  Delete
                </button>
              </div>
            </div>

            {filters.reportType === "details" && (
              <div className="mt-4 text-xs bg-gray-50 rounded-lg p-3 space-y-2 overflow-x-auto">
                <Section title="Hearings" data={item.hearings?.hearings} />
                <Section title="Journals" data={item.journals?.entries} />
                <Section title="Renewals" data={item.renewals?.entries} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicSearchReport;

const Input = (props) => (
  <input {...props} className="w-full px-4 py-3 rounded-lg bg-gray-100 border focus:ring-1 focus:ring-[#3E4A8A]" />
);

const Select = ({ children, ...props }) => (
  <select {...props} className="w-full px-4 py-3 rounded-lg bg-gray-100 border focus:ring-1 focus:ring-[#3E4A8A]">
    {children}
  </select>
);

const Section = ({ title, data }) => (
  <>
    <p className="font-semibold text-gray-600">{title}</p>
    <pre className="overflow-x-auto text-xs">{JSON.stringify(data || [], null, 2)}</pre>
  </>
);