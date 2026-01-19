// Utility to check user permissions
export const hasPermission = (permKey) => {
  if (!permKey) return false;

  try {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    if (!authUser || !authUser.permissions) return false;

    const perms = authUser.permissions;

    // Support array of permissions
    if (Array.isArray(permKey)) {
      return permKey.some((p) => perms[p] === true);
    }

    // Single permission
    return perms[permKey] === true;
  } catch (err) {
    console.error("hasPermission error:", err);
    return false;
  }
};
