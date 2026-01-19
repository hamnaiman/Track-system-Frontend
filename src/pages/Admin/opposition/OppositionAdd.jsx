import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";
import OppositionProceedingsHearings from "./OppositionProceedingsHearings";

const OppositionAdd = () => {
  const [loading, setLoading] = useState(false);
  const [savedOpposition, setSavedOpposition] = useState(null);

  const initialState = {
    oppositionNumber: "",
    fileNumber: "",
    applicationNumber: "",
    oppositionDate: "",
    oppositionType: "Opponent",
    status: "Pending",
    remarks: "",
    otherSide: {
      applicationNumber: "",
      trademark: "",
      class: "",
      goods: "",
      applicationFiledOn: "",
      periodOfUse: "",
      journalNumber: "",
      journalPage: "",
      journalDate: "",
      publicationDate: "",
      clientName: "",
      clientAddress: "",
      advocateName: "",
      advocateAddress: ""
    }
  };

  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleOtherSide = (field, value) => {
    setForm({ ...form, otherSide: { ...form.otherSide, [field]: value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.oppositionNumber || !form.applicationNumber || !form.oppositionDate) {
      toast.error("Opposition No, Application No & Date required");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/oppositions", form);
      toast.success("Opposition saved successfully");
      setSavedOpposition(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] p-4 space-y-10 max-w-7xl mx-auto">

      {/* FORM CARD */}
      {!savedOpposition && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow space-y-6">

          {/* HEADER INSIDE CARD */}
          <div>
            <h2 className="text-2xl font-bold text-[#3E4A8A]">Add Opposition</h2>
            <p className="text-sm text-gray-500 mb-6">
              Manage opposition details and other side information
            </p>
          </div>

          {/* BASIC INFO */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input name="oppositionNumber" placeholder="Opposition No" value={form.oppositionNumber} onChange={handleChange} />
            <Input name="fileNumber" placeholder="File No" value={form.fileNumber} onChange={handleChange} />
            <Input name="applicationNumber" placeholder="Application No" value={form.applicationNumber} onChange={handleChange} />
            <Input type="date" name="oppositionDate" value={form.oppositionDate} onChange={handleChange} />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select className="input" name="oppositionType" value={form.oppositionType} onChange={handleChange}>
              <option value="Opponent">Opponent</option>
              <option value="Applicant">Applicant</option>
            </select>
            <select className="input" name="status" value={form.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Decided">Decided</option>
              <option value="Withdrawn">Withdrawn</option>
            </select>
          </section>

          <textarea className="input w-full" rows="3" placeholder="Remarks" name="remarks" value={form.remarks} onChange={handleChange} />

          {/* OTHER SIDE */}
          <div className="border rounded-xl bg-gray-50 p-5 space-y-5">
            <h4 className="font-semibold mb-2">Other Side Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input placeholder="Application No" value={form.otherSide.applicationNumber} onChange={(e) => handleOtherSide("applicationNumber", e.target.value)} />
              <Input placeholder="Trademark" value={form.otherSide.trademark} onChange={(e) => handleOtherSide("trademark", e.target.value)} />
              <Input placeholder="Class" value={form.otherSide.class} onChange={(e) => handleOtherSide("class", e.target.value)} />
              <Input type="date" value={form.otherSide.applicationFiledOn} onChange={(e) => handleOtherSide("applicationFiledOn", e.target.value)} />
            </div>

            <textarea className="input w-full" rows="2" placeholder="Goods" value={form.otherSide.goods} onChange={(e) => handleOtherSide("goods", e.target.value)} />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input placeholder="Period of Use" value={form.otherSide.periodOfUse} onChange={(e) => handleOtherSide("periodOfUse", e.target.value)} />
              <Input placeholder="Journal No" value={form.otherSide.journalNumber} onChange={(e) => handleOtherSide("journalNumber", e.target.value)} />
              <Input placeholder="Journal Page" value={form.otherSide.journalPage} onChange={(e) => handleOtherSide("journalPage", e.target.value)} />
              <Input type="date" value={form.otherSide.journalDate} onChange={(e) => handleOtherSide("journalDate", e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Client Name" value={form.otherSide.clientName} onChange={(e) => handleOtherSide("clientName", e.target.value)} />
              <Input placeholder="Client Address" value={form.otherSide.clientAddress} onChange={(e) => handleOtherSide("clientAddress", e.target.value)} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Advocate Name" value={form.otherSide.advocateName} onChange={(e) => handleOtherSide("advocateName", e.target.value)} />
              <Input placeholder="Advocate Address" value={form.otherSide.advocateAddress} onChange={(e) => handleOtherSide("advocateAddress", e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end">
            <button disabled={loading} className="bg-[#3E4A8A] text-white px-8 py-2 rounded-lg">
              {loading ? "Saving..." : "Save Opposition"}
            </button>
          </div>
        </form>
      )}

      {/* SAVED OPPOSITION */}
      {savedOpposition && (
        <>
          <div className="bg-blue-50 border rounded-xl p-5">
            <h3 className="font-semibold text-lg mb-3">Opposition Saved</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div><b>Opposition No:</b> {savedOpposition.oppositionNumber}</div>
              <div><b>File No:</b> {savedOpposition.fileNumber}</div>
              <div><b>Application No:</b> {savedOpposition.applicationNumber}</div>
              <div><b>Status:</b> {savedOpposition.status}</div>
            </div>
          </div>

          <OppositionProceedingsHearings oppositionNumber={savedOpposition.oppositionNumber} />
        </>
      )}
    </div>
  );
};

export default OppositionAdd;

const Input = (props) => <input {...props} className="input" />;
