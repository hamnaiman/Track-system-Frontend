import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const CustomerRegistration = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    partyType: "Local",
    customerName: "",
    city: "",
    country: "",
    phone: "",
    email: "",
    businessType: "",
    agent: ""
  });

  const [contactPersons, setContactPersons] = useState([
    { name: "", designation: "", email: "", mobile: "" }
  ]);

  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [agents, setAgents] = useState([]);

  /* ================= LOAD DROPDOWNS ================= */
  useEffect(() => {
    api.get("/countries").then(res => setCountries(res.data || []));
    api.get("/business-types").then(res => setBusinessTypes(res.data || []));
    api.get("/agents").then(res => setAgents(res.data?.data || []));
  }, []);

  useEffect(() => {
    if (!form.country) {
      setCities([]);
      return;
    }

    api
      .get(`/cities?countryId=${form.country}`)
      .then(res => setCities(res.data || []))
      .catch(() => setCities([]));
  }, [form.country]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleContactChange = (index, e) => {
    const updated = [...contactPersons];
    updated[index][e.target.name] = e.target.value;
    setContactPersons(updated);
  };

  const addContactPerson = () => {
    setContactPersons([
      ...contactPersons,
      { name: "", designation: "", email: "", mobile: "" }
    ]);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await api.post("/customers", { ...form, contactPersons });

      toast.success("Customer registered successfully");

      setForm({
        partyType: "Local",
        customerName: "",
        city: "",
        country: "",
        phone: "",
        email: "",
        businessType: "",
        agent: ""
      });

      setContactPersons([
        { name: "", designation: "", email: "", mobile: "" }
      ]);
      setCities([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Customer creation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">

        {/* ===== HEADER ===== */}
        <div className="bg-gradient-to-r from-[#3E4A8A] to-[#5A6ACF] p-6 text-white">
          <h2 className="text-2xl font-bold">Customer Registration</h2>
          <p className="text-sm opacity-90">
            Create and manage trademark customers
          </p>
        </div>

        {/* ===== FORM ===== */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">

          {/* BASIC INFO */}
          <Section title="Basic Information">
            <Grid>
              <Select
                label="Party Type"
                name="partyType"
                value={form.partyType}
                onChange={handleChange}
              >
                <option value="Local">Local</option>
                <option value="Foreign">Foreign</option>
              </Select>

              <Input
                label="Customer Name"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                required
              />
            </Grid>
          </Section>

          {/* LOCATION */}
          <Section title="Location Details">
            <Grid>
              <Select
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
                required
              >
                <option value="">Select Country</option>
                {countries.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </Select>

              <Select
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
              >
                <option value="">Select City</option>
                {cities.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </Select>
            </Grid>
          </Section>

          {/* BUSINESS */}
          <Section title="Business Information">
            <Grid>
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

              <Select
                label="Business Type"
                name="businessType"
                value={form.businessType}
                onChange={handleChange}
                required
              >
                <option value="">Select Business Type</option>
                {businessTypes.map(bt => (
                  <option key={bt._id} value={bt._id}>{bt.name}</option>
                ))}
              </Select>

              <Select
                label="Agent"
                name="agent"
                value={form.agent}
                onChange={handleChange}
              >
                <option value="">Select Agent</option>
                {agents.map(a => (
                  <option key={a._id} value={a._id}>{a.agentName}</option>
                ))}
              </Select>
            </Grid>
          </Section>

          {/* CONTACT PERSONS */}
          <Section title="Contact Persons">
            {contactPersons.map((cp, index) => (
              <div
                key={index}
                className="bg-white border rounded-xl p-4 mb-4 shadow-sm"
              >
                <Grid>
                  <Input label="Name" name="name" value={cp.name}
                    onChange={(e) => handleContactChange(index, e)} />

                  <Input label="Designation" name="designation" value={cp.designation}
                    onChange={(e) => handleContactChange(index, e)} />

                  <Input label="Email" name="email" value={cp.email}
                    onChange={(e) => handleContactChange(index, e)} />

                  <Input label="Mobile" name="mobile" value={cp.mobile}
                    onChange={(e) => handleContactChange(index, e)} />
                </Grid>
              </div>
            ))}

            <button
              type="button"
              onClick={addContactPerson}
              className="text-sm font-semibold text-[#3E4A8A] hover:underline"
            >
              + Add Contact Person
            </button>
          </Section>

          {/* SUBMIT */}
          <div className="flex justify-end pt-4">
            <button
              disabled={loading}
              className="
                bg-[#3E4A8A] hover:bg-[#2f396f]
                disabled:opacity-60
                text-white px-12 py-3 rounded-xl
                font-semibold shadow-lg transition
              "
            >
              {loading ? "Saving..." : "Save Customer"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CustomerRegistration;

/* ================= UI HELPERS ================= */

const Section = ({ title, children }) => (
  <div className="space-y-6 bg-slate-50 p-5 rounded-xl border">
    <h3 className="text-base font-semibold text-[#3E4A8A] tracking-wide">
      {title}
    </h3>
    {children}
  </div>
);

const Grid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {children}
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
      {label}
    </label>
    <input
      {...props}
      className="
        h-11 px-4 rounded-lg border border-gray-300
        bg-white text-sm
        focus:outline-none focus:ring-2 focus:ring-[#3E4A8A]/30
        focus:border-[#3E4A8A]
        transition
      "
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
      {label}
    </label>
    <select
      {...props}
      className="
        h-11 px-4 rounded-lg border border-gray-300
        bg-white text-sm
        focus:outline-none focus:ring-2 focus:ring-[#3E4A8A]/30
        focus:border-[#3E4A8A]
        transition
      "
    >
      {children}
    </select>
  </div>
);