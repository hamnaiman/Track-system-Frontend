import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const OppositionProceedingsHearings = ({ oppositionNumber }) => {
  const [opposition, setOpposition] = useState(null);

  /* ================= STATES ================= */
  const [proceeding, setProceeding] = useState({ date: "", remark: "" });
  const [hearing, setHearing] = useState({
    hearingDate: "",
    before: "",
    comments: ""
  });
  const [reminder, setReminder] = useState({ date: "", text: "" });

  /* ================= TOAST CONFIRM ================= */
  const confirmToast = (message, onConfirm) => {
    toast(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="text-sm">{message}</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={closeToast}
              className="px-3 py-1 text-sm border rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                closeToast();
              }}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false
      }
    );
  };

  /* ================= FETCH ================= */
  const fetchOpposition = async () => {
    if (!oppositionNumber) return;
    try {
      const res = await api.get(`/oppositions/${oppositionNumber}`);
      setOpposition(res.data);
    } catch {
      toast.error("Failed to load opposition");
    }
  };

  useEffect(() => {
    fetchOpposition();
  }, [oppositionNumber]);

  /* ================= PROCEEDINGS ================= */
  const addProceeding = async () => {
    if (!proceeding.date || !proceeding.remark) {
      toast.error("Date & remark required");
      return;
    }

    try {
      await api.post(
        `/oppositions/${oppositionNumber}/proceedings`,
        proceeding
      );
      toast.success("Proceeding added");
      setProceeding({ date: "", remark: "" });
      fetchOpposition();
    } catch {
      toast.error("Failed to add proceeding");
    }
  };

  const deleteProceeding = (id) => {
    confirmToast("Delete this proceeding?", async () => {
      try {
        await api.delete(
          `/oppositions/${oppositionNumber}/proceedings/${id}`
        );
        toast.success("Proceeding deleted");
        fetchOpposition();
      } catch {
        toast.error("Failed to delete proceeding");
      }
    });
  };

  /* ================= HEARINGS ================= */
  const addHearing = async () => {
    if (!hearing.hearingDate) {
      toast.error("Hearing date required");
      return;
    }

    try {
      await api.post(
        `/oppositions/${oppositionNumber}/hearings`,
        hearing
      );
      toast.success("Hearing added");
      setHearing({ hearingDate: "", before: "", comments: "" });
      fetchOpposition();
    } catch {
      toast.error("Failed to add hearing");
    }
  };

  const deleteHearing = (id) => {
    confirmToast("Delete this hearing?", async () => {
      try {
        await api.delete(
          `/oppositions/${oppositionNumber}/hearings/${id}`
        );
        toast.success("Hearing deleted");
        fetchOpposition();
      } catch {
        toast.error("Failed to delete hearing");
      }
    });
  };

  /* ================= REMINDERS ================= */
  const addReminder = async () => {
    if (!reminder.date || !reminder.text) {
      toast.error("Reminder date & text required");
      return;
    }

    try {
      await api.post(
        `/oppositions/${oppositionNumber}/reminders`,
        reminder
      );
      toast.success("Reminder added");
      setReminder({ date: "", text: "" });
      fetchOpposition();
    } catch {
      toast.error("Failed to add reminder");
    }
  };

  const deleteReminder = (id) => {
    confirmToast("Delete this reminder?", async () => {
      try {
        await api.delete(
          `/oppositions/${oppositionNumber}/reminders/${id}`
        );
        toast.success("Reminder deleted");
        fetchOpposition();
      } catch {
        toast.error("Failed to delete reminder");
      }
    });
  };

  if (!opposition) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* ================= PROCEEDINGS ================= */}
      <div className="bg-white border rounded-xl p-5 shadow">
        <h3 className="font-semibold text-lg text-[#3E4A8A] mb-4">
          Proceedings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <input
            type="date"
            className="input"
            value={proceeding.date}
            onChange={e =>
              setProceeding({ ...proceeding, date: e.target.value })
            }
          />
          <input
            className="input md:col-span-2"
            placeholder="Remark (TM-5, TM-6 etc)"
            value={proceeding.remark}
            onChange={e =>
              setProceeding({ ...proceeding, remark: e.target.value })
            }
          />
          <button
            onClick={addProceeding}
            className="bg-[#3E4A8A] text-white rounded"
          >
            Add
          </button>
        </div>

        {opposition.proceedings.map((p, i) => (
          <div key={p._id} className="flex justify-between text-sm border-b py-2">
            <span>
              {i + 1}. {new Date(p.date).toLocaleDateString()} – {p.remark}
            </span>
            <button
              onClick={() => deleteProceeding(p._id)}
              className="text-red-600 text-xs"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ================= HEARINGS ================= */}
      <div className="bg-white border rounded-xl p-5 shadow">
        <h3 className="font-semibold text-lg text-[#3E4A8A] mb-4">
          Hearings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <input
            type="date"
            className="input"
            value={hearing.hearingDate}
            onChange={e =>
              setHearing({ ...hearing, hearingDate: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Before"
            value={hearing.before}
            onChange={e =>
              setHearing({ ...hearing, before: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Comments"
            value={hearing.comments}
            onChange={e =>
              setHearing({ ...hearing, comments: e.target.value })
            }
          />
          <button
            onClick={addHearing}
            className="bg-[#3E4A8A] text-white rounded"
          >
            Add
          </button>
        </div>

        {opposition.hearings.map(h => (
          <div key={h._id} className="flex justify-between text-sm border-b py-2">
            <span>
              {new Date(h.hearingDate).toLocaleDateString()} – {h.before}
            </span>
            <button
              onClick={() => deleteHearing(h._id)}
              className="text-red-600 text-xs"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* ================= REMINDERS ================= */}
      <div className="bg-white border rounded-xl p-5 shadow">
        <h3 className="font-semibold text-lg text-[#3E4A8A] mb-4">
          Reminders
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <input
            type="date"
            className="input"
            value={reminder.date}
            onChange={e =>
              setReminder({ ...reminder, date: e.target.value })
            }
          />
          <input
            className="input"
            placeholder="Reminder text"
            value={reminder.text}
            onChange={e =>
              setReminder({ ...reminder, text: e.target.value })
            }
          />
          <button
            onClick={addReminder}
            className="bg-[#3E4A8A] text-white rounded"
          >
            Add
          </button>
        </div>

        {opposition.reminders.map(r => (
          <div key={r._id} className="flex justify-between text-sm border-b py-2">
            <span>
              {new Date(r.date).toLocaleDateString()} – {r.text}
            </span>
            <button
              onClick={() => deleteReminder(r._id)}
              className="text-red-600 text-xs"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OppositionProceedingsHearings;
