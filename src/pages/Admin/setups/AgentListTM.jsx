import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const AgentListTM = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const res = await api.get("/agents");
      setAgents(res.data?.data || []);
    } catch {
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="font-semibold text-sm">Delete this agent?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                await api.delete(`/agents/${id}`);
                handleGenerate();
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

      {/* HEADER */}
      <div className="px-6">
        <h2 className="text-2xl font-bold text-[#3E4A8A]">
          Agent List – TM
        </h2>
        <p className="text-gray-500">
          View all registered trademark agents
        </p>
      </div>

      {/* GENERATE */}
      <div className="mx-4 md:mx-6 bg-white rounded-xl border shadow p-6 flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Registered Agents</h3>
          <p className="text-sm text-gray-500">Generate agent list</p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-[#3E4A8A] text-white px-6 py-2 rounded-lg"
        >
          {loading ? "Loading..." : "Generate List"}
        </button>
      </div>

      {/* AGENT CARDS */}
      {agents.length > 0 && (
        <div className="mx-4 md:mx-6 bg-white border shadow rounded-xl p-6">

          <h3 className="text-xl font-bold text-[#3E4A8A] mb-6">
            Agent Records
          </h3>

          {/* RESPONSIVE GRID */}
          <div className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-4 
            gap-5
          ">
            {agents.map((agent) => {
              const cp = agent.contactPersons?.[0];
              return (
                <div
                  key={agent._id}
                  className="border rounded-xl shadow-sm p-4 space-y-2 hover:shadow-md transition"
                >
                  {/* TOP */}
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-[#3E4A8A] leading-tight">
                      {agent.agentName}
                    </h4>
                    <button
                      onClick={() => handleDelete(agent._id)}
                      className="text-red-600 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>

                  {/* DETAILS */}
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><b>User ID:</b> {agent.userId || "-"}</p>
                    <p><b>Phone:</b> {agent.phone}</p>
                    <p><b>City:</b> {agent.city}</p>
                    <p><b>Country:</b> {agent.country}</p>
                    <p className="break-all"><b>Email:</b> {agent.email}</p>
                  </div>

                  {/* CONTACT PERSON */}
                  {cp && (
                    <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                      <p className="font-semibold">{cp.name}</p>
                      <p>{cp.designation}</p>
                      <p>{cp.mobile}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
};

export default AgentListTM;