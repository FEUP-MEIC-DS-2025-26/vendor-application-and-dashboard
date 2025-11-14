import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import VendorRegister from "./VendorRegister";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard navigate={(to) => window.location.href = to} />} />
        <Route path="/register" element={<VendorRegister onSuccess={() => window.location.href = "/dashboard"} onCancel={() => window.location.href = "/dashboard"} />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
