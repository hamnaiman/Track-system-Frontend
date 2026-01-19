import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const CustomerListTM = () => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  /* ================= GENERATE LIST ================= */
  const handleGenerate = async () => {
    try {
      setLoading(true);
      toast.info("Generating customer list...");

      const res = await api.get("/customers");

      if (!res.data?.data?.length) {
        toast.warning("No registered customers found");
        setCustomers([]);
        return;
      }

      setCustomers(res.data.data);
      toast.success("Customer list generated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate customer list");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="font-semibold text-sm">
            Delete this customer permanently?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/customers/${id}`);
                  toast.success("Customer deleted successfully");
                  handleGenerate();
                } catch {
                  toast.error("Delete failed");
                }
                closeToast();
              }}
              className="bg-red-600 text-white px-4 py-1 rounded"
            >
              Delete
            </button>

            <button
              onClick={closeToast}
              className="bg-gray-200 px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  return (
    <div className="w-full space-y-8">

      {/* ===== HEADER ===== */}
      <div className="px-6">
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Customer List – TM
        </h2>
        <p className="text-sm text-gray-500">
          View all registered trademark customers
        </p>
      </div>

      {/* ===== ACTION CARD ===== */}
      <div className="mx-4 md:mx-6 bg-white rounded-xl border shadow p-6 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-700">
            Registered Customers
          </h3>
          <p className="text-sm text-gray-500">
            Generate and view customer list
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-[#3E4A8A] text-white px-6 py-2 rounded-lg disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate List"}
        </button>
      </div>

      {/* ===== CUSTOMER CARDS ===== */}
      {customers.length > 0 && (
        <div className="mx-4 md:mx-6 bg-white border shadow rounded-xl p-6">

          <h3 className="text-xl font-bold text-[#3E4A8A] mb-6">
            Customer Records
          </h3>

          <div
            className="
              grid 
              grid-cols-1 
              sm:grid-cols-2 
              lg:grid-cols-3 
              xl:grid-cols-4 
              gap-5
            "
          >
            {customers.map((c) => (
              <div
                key={c._id}
                className="border rounded-xl shadow-sm p-4 space-y-2 hover:shadow-md transition"
              >
                {/* TOP */}
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-[#3E4A8A] leading-tight">
                    {c.customerName}
                  </h4>

                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-red-600 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>

                {/* DETAILS */}
                <div className="text-sm space-y-1 text-gray-700">
                  <p><b>Business:</b> {c.businessType?.name || "-"}</p>
                  <p><b>City:</b> {c.city?.name || "-"}</p>
                  <p><b>Country:</b> {c.country?.name || "-"}</p>
                  <p><b>Agent:</b> {c.agent?.agentName || "-"}</p>
                  <p className="break-all"><b>Email:</b> {c.email || "-"}</p>
                  <p><b>Phone:</b> {c.phone || "-"}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default CustomerListTM;