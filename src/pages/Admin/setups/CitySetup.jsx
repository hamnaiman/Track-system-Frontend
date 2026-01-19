import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const CitySetup = () => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryId, setCountryId] = useState("");
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===== FETCH COUNTRIES ===== */
  const fetchCountries = async () => {
    try {
      const res = await api.get("/countries");
      setCountries(res.data || []);
    } catch {
      toast.error("Failed to load countries");
    }
  };

  /* ===== FETCH CITIES ===== */
  const fetchCities = async (cid) => {
    try {
      const res = await api.get(`/cities?countryId=${cid}`);
      setCities(res.data || []);
    } catch {
      setCities([]);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (countryId) fetchCities(countryId);
    else setCities([]);
  }, [countryId]);

  /* ===== SUBMIT ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!countryId || !name.trim()) {
      toast.warning("Country & City name required");
      return;
    }

    try {
      setLoading(true);

      if (editId) {
        await api.put(`/cities/${editId}`, { name });
        toast.success("City updated successfully");
      } else {
        await api.post("/cities", { countryId, name });
        toast.success("City added successfully");
      }

      setName("");
      setEditId(null);
      fetchCities(countryId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===== EDIT ===== */
  const handleEdit = (city) => {
    setName(city.name);
    setEditId(city._id);
  };

  /* ===== DELETE ===== */
  const handleDelete = (id) => {
    toast.info(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold text-sm">
            Delete this city permanently?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/cities/${id}`);
                  toast.success("City deleted successfully");
                  fetchCities(countryId);
                } catch {
                  toast.error("Delete failed");
                }
                closeToast();
              }}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Yes, Delete
            </button>

            <button
              onClick={closeToast}
              className="bg-gray-200 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* ===== FORM CARD ===== */}
      <div className="bg-white rounded-2xl shadow-md border p-8">
        <h2 className="text-2xl font-bold text-[#3E4A8A] mb-2">
          City Setup
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Add new cities and assign them to a country
        </p>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {/* COUNTRY */}
          <select
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* CITY NAME */}
          <input
            type="text"
            placeholder="City Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300
                       focus:outline-none focus:ring-2 focus:ring-blue-200"
          />

          {/* SUBMIT */}
          <button
            disabled={loading}
            className="bg-[#3E4A8A] hover:bg-[#2f3970]
                       text-white px-6 py-3 rounded-lg font-semibold
                       transition disabled:opacity-60"
          >
            {loading ? "Processing..." : editId ? "Update" : "Save"}
          </button>

          {/* CANCEL */}
          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setName("");
              }}
              className="px-6 py-3 rounded-lg border border-gray-300
                         text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* ===== TABLE CARD ===== */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <h3 className="text-xl font-bold text-[#3E4A8A] mb-2">
          Cities List
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          View and manage all cities for each country
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-blue-50 text-[#3E4A8A]">
              <tr>
                <th className="p-3 border text-left">#</th>
                <th className="p-3 border text-left">City Name</th>
                <th className="p-3 border text-center">Edit</th>
                <th className="p-3 border text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {cities.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-4 text-gray-500"
                  >
                    No cities found
                  </td>
                </tr>
              ) : (
                cities.map((city, index) => (
                  <tr
                    key={city._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{city.name}</td>

                    <td
                      onClick={() => handleEdit(city)}
                      className="p-3 text-center text-[#3E4A8A]
                                 cursor-pointer hover:underline"
                    >
                      Edit
                    </td>

                    <td
                      onClick={() => handleDelete(city._id)}
                      className="p-3 text-center text-red-600
                                 cursor-pointer hover:underline"
                    >
                      Delete
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default CitySetup;
