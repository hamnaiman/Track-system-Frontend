// utils/helper.js

// Format date clean
export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB");
};

// Convert text to Capitalized (First letter big)
export const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
};

// Generate unique temporary ID (for dummy frontend)
export const generateTempId = () => {
    return "TMP-" + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Show alert / message (Frontend only)
export const showMessage = (msg) => {
    alert(msg);
};
