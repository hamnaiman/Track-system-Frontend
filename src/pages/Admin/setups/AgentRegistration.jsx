import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const AgentRegistration = () => {
  const [loading, setLoading] = useState(false);

  // 🔒 STATE MATCHES BACKEND MODEL EXACTLY
  const [form, setForm] = useState({
    agentName: "",
    phone: "",
    email: "",
    city: "",
    country: "",
    contactPersons: [
      {
        name: "",
        designation: "",
        email: "",
        mobile: ""
      }
    ]
  });

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContactChange = (e) => {
    const updated = [...form.contactPersons];
    updated[0][e.target.name] = e.target.value;
    setForm({ ...form, contactPersons: updated });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔴 HARD FRONTEND VALIDATION (MATCHES BACKEND)
    if (!form.agentName || !form.city || !form.country) {
      toast.error("Agent Name, City and Country are required");
      return;
    }

    const cp = form.contactPersons[0];
    if (!cp.name || !cp.designation || !cp.email || !cp.mobile) {
      toast.error("All Contact Person fields are required");
      return;
    }

    try {
      setLoading(true);

      // DEBUG (keep for now)
      console.log("AGENT SUBMIT PAYLOAD:", form);

      const res = await api.post("/agents", form);

      toast.success(
        <div className="space-y-1">
          <p className="font-semibold text-sm">
            Agent Registered Successfully
          </p>
          <p className="text-sm">
            User ID: <b>{res.data.credentials.userId}</b>
          </p>
          <p className="text-sm">
            Password: <b>{res.data.credentials.password}</b>
          </p>
        </div>,
        { autoClose: false }
      );

      // RESET FORM
      setForm({
        agentName: "",
        phone: "",
        email: "",
        city: "",
        country: "",
        contactPersons: [
          { name: "", designation: "", email: "", mobile: "" }
        ]
      });

    } catch (err) {
      console.error("AGENT CREATE ERROR:", err.response?.data);
      toast.error(err.response?.data?.message || "Agent registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white border shadow-xl rounded-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#3E4A8A] to-[#5A6ACF] p-6 text-white">
          <h2 className="text-2xl font-bold">Agent Registration</h2>
          <p className="text-sm opacity-90">
            Create a new trademark agent account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">

          {/* BASIC INFO */}
          <Section title="Basic Information">
            <Grid>
              <Input
                label="Agent Name"
                name="agentName"
                value={form.agentName}
                onChange={handleChange}
                required
              />
              <Input
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              <Input
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </Grid>
          </Section>

          {/* LOCATION */}
          <Section title="Location Details">
            <Grid>
                <Input
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
                required
              />
              <Input
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              />
            
            </Grid>
          </Section>

          {/* CONTACT PERSON */}
          <Section title="Contact Person">
            <Grid>
              <Input
                label="Name"
                name="name"
                value={form.contactPersons[0].name}
                onChange={handleContactChange}
                required
              />
              <Input
                label="Designation"
                name="designation"
                value={form.contactPersons[0].designation}
                onChange={handleContactChange}
                required
              />
              <Input
                label="Mobile"
                name="mobile"
                value={form.contactPersons[0].mobile}
                onChange={handleContactChange}
                required
              />
              <Input
                label="Email"
                name="email"
                value={form.contactPersons[0].email}
                onChange={handleContactChange}
                required
              />
            </Grid>
          </Section>

          {/* SUBMIT */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#3E4A8A] hover:bg-[#2f396f]
                         text-white px-8 py-2 rounded-lg shadow font-medium"
            >
              {loading ? "Registering..." : "Register Agent"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AgentRegistration;

/* ================= UI HELPERS ================= */

const Section = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-[#3E4A8A] border-b pb-2">
      {title}
    </h3>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    {children}
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      {...props}
      className="border rounded-lg px-3 py-2
                 focus:outline-none focus:ring-2 focus:ring-[#3E4A8A]"
    />
  </div>
);
