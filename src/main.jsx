import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ✅ Toast Notification Setup
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    {/* ✅ Global Toast Provider */}
    <ToastContainer position="top-right" autoClose={2500} />
  </React.StrictMode>
);
