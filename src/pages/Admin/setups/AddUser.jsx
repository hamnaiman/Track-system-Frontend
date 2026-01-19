import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

const AddUser = () => {
  const [form, setForm] = useState({ fullName: "", email: "" });
  const [defaultRoleId, setDefaultRoleId] = useState("");
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState({
    add: false,
    edit: false,
    delete: false,
    print: false,
  });

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetchDefaultRole();
    fetchUsers();
  }, []);

  const fetchDefaultRole = async () => {
    try {
      const res = await api.get("/roles");
      const userRole = res.data.data.find(
        (r) => r.roleName.toLowerCase() === "user"
      );
      if (userRole) setDefaultRoleId(userRole._id);
    } catch {
      toast.error("Failed to load roles");
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data || []);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const togglePermission = (key) =>
    setPermissions({ ...permissions, [key]: !permissions[key] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName) return toast.error("Full Name is required");
    if (!defaultRoleId) return toast.error("Role not loaded yet");

    try {
      const res = await api.post("/users", {
        fullName: form.fullName,
        email: form.email,
        roleId: defaultRoleId,
        permissionsOverride: permissions,
      });

      toast.success(
        `User Created Successfully\nUser ID: ${res.data.credentials.userId}\nPassword: ${res.data.credentials.password}`
      );

      setForm({ fullName: "", email: "" });
      setPermissions({ add: false, edit: false, delete: false, print: false });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "User creation failed");
    }
  };

  const handleDelete = (userId) => {
    toast.info(
      ({ closeToast }) => (
        <div className="space-y-3">
          <p className="font-semibold text-sm">Delete this user?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                try {
                  await api.delete(`/users/${userId}`);
                  toast.success("User deleted successfully");
                  fetchUsers();
                } catch {
                  toast.error("Failed to delete user");
                }
                closeToast();
              }}
              className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400 transition"
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

      {/* ===== HEADER CARD ===== */}
      <div className="bg-white p-6 rounded-2xl shadow border">
        <h2 className="text-2xl font-bold text-[#3E4A8A] mb-2">Add New User</h2>
        <p className="text-sm text-gray-500">Add a new user and assign default permissions</p>
      </div>

      {/* ===== ADD USER FORM ===== */}
      <div className="bg-white rounded-2xl shadow border p-6">
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <Input name="fullName" value={form.fullName} onChange={handleChange} label="Full Name" required />
          <Input name="email" value={form.email} onChange={handleChange} label="Email (Optional)" />

          {/* Permissions */}
          <div className="sm:col-span-2">
            <p className="text-sm sm:text-base font-semibold text-gray-600 mb-2">
              Permissions For Applications:
            </p>
            <div className="flex flex-wrap gap-2">
              {["add", "edit", "delete", "print"].map((p) => (
                <label
                  key={p}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-xs sm:text-sm
                    ${permissions[p]
                      ? "bg-blue-50 border-[#3E4A8A] text-[#3E4A8A]"
                      : "bg-gray-50 border-gray-300 text-gray-600"
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={permissions[p]}
                    onChange={() => togglePermission(p)}
                    className="hidden"
                  />
                  {p.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 flex justify-center sm:justify-end">
            <button
              type="submit"
              className="bg-[#3E4A8A] hover:bg-[#2f3970] text-white px-6 py-3 rounded-lg font-semibold transition w-full sm:w-auto"
            >
              Create User
            </button>
          </div>
        </form>
      </div>

      {/* ===== USERS LIST ===== */}
      <div className="bg-white rounded-2xl shadow border p-6">
        <h2 className="text-2xl font-bold text-[#3E4A8A] mb-2">Existing Users</h2>
        <p className="text-sm text-gray-500 mb-6">View all users and manage their status</p>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[500px]">
            <thead className="bg-blue-50 text-[#3E4A8A]">
              <tr>
                <th className="px-3 py-2 text-left">User ID</th>
                <th className="px-3 py-2 text-left">Full Name</th>
                <th className="px-3 py-2 text-left">Permissions</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">No users found</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2">{u.userId}</td>
                    <td className="px-3 py-2">{u.fullName}</td>
                    <td className="px-3 py-2 text-xs md:text-sm">
                      {Object.entries(u.permissionsOverride || {})
                        .filter(([k, v]) => v && ["add","edit","delete","print"].includes(k))
                        .map(([k]) => k.toUpperCase())
                        .join(", ") || "NONE"}
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-1 rounded text-xs md:text-sm font-medium ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center sm:text-right">
                      {u.role?.roleName.toLowerCase() !== "admin" && u._id !== currentUserId && (
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs md:text-sm w-full sm:w-auto"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-4">
          {users.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No users found</p>
          ) : (
            users.map((u) => (
              <div key={u._id} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                <p className="text-sm font-semibold"><span className="text-gray-600">User ID: </span>{u.userId}</p>
                <p className="text-sm font-semibold"><span className="text-gray-600">Full Name: </span>{u.fullName}</p>
                <p className="text-sm font-semibold"><span className="text-gray-600">Permissions: </span>{Object.entries(u.permissionsOverride || {}).filter(([k, v]) => v && ["add","edit","delete","print"].includes(k)).map(([k]) => k.toUpperCase()).join(", ") || "NONE"}</p>
                <p className="text-sm font-semibold"><span className="text-gray-600">Status: </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{u.isActive ? "Active" : "Inactive"}</span>
                </p>
                {u.role?.roleName.toLowerCase() !== "admin" && u._id !== currentUserId && (
                  <button onClick={() => handleDelete(u._id)} className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm">
                    Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddUser;

/* ===== Input Component ===== */
const Input = ({ label, ...props }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3E4A8A] text-sm"
    />
  </div>
);
