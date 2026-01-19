import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ApplicationDetails = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/my-applications");
      setApplications(res.data?.data || []);
    } catch (err) {
      console.error(err);
      if (err.response?.status !== 401) {
        toast.error("Failed to load applications");
      }
    } finally {
      setLoading(false);
    }
  };

  const openDetails = (id) => {
    navigate(`/user/trademark/application/view/${id}`);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#3E4A8A]">
          Application Details
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
          You can view and print your trademark applications
        </p>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white border rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-blue-50 text-[#3E4A8A]">
  <tr>
    <th className="border px-3 py-2 font-semibold">
      Application No
    </th>
    <th className="border px-3 py-2 font-semibold">
      Trademark
    </th>
    <th className="border px-3 py-2 font-semibold">
      Status
    </th>
    <th className="border px-3 py-2 font-semibold">
      Classes
    </th>
    <th className="border px-3 py-2 text-center font-semibold">
      Action
    </th>
  </tr>
</thead>


          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="py-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && applications.length === 0 && (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-500">
                  No applications found
                </td>
              </tr>
            )}

            {!loading &&
              applications.map((app) => (
                <tr key={app._id} className="hover:bg-blue-50">
                  <td className="border px-3 py-2">
                    {app.applicationNumber}
                  </td>
                  <td className="border px-3 py-2">
                    {app.trademark}
                  </td>
                  <td className="border px-3 py-2">
                    {app.status?.description || "-"}
                  </td>
                  <td className="border px-3 py-2">
                    {app.classes?.join(", ") || "-"}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => openDetails(app._id)}
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      View / Print
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden flex flex-col gap-3">
        {loading && (
          <div className="bg-white p-4 rounded shadow text-center">
            Loading...
          </div>
        )}

        {!loading && applications.length === 0 && (
          <div className="bg-white p-4 rounded shadow text-center text-gray-500">
            No applications found
          </div>
        )}

        {!loading &&
          applications.map((app) => (
            <div
              key={app._id}
              className="bg-white border rounded shadow p-4 flex flex-col gap-2"
            >
              <div>
                <p className="text-xs text-gray-500">Application No</p>
                <p className="font-medium">{app.applicationNumber}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Trademark</p>
                <p>{app.trademark}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p>{app.status?.description || "-"}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Classes</p>
                <p>{app.classes?.join(", ") || "-"}</p>
              </div>

              <button
                onClick={() => openDetails(app._id)}
                className="mt-2 w-full py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                View / Print
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ApplicationDetails;
