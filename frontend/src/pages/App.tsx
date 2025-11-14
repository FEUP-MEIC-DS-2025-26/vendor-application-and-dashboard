import React, { useState } from "react";
import Dashboard from "./Dashboard";
import VendorRegister from "./VendorRegister";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"dashboard" | "register">("dashboard");

  const navigate = (to: string) => {
    if (to === "/register") {
      setCurrentPage("register");
    } else if (to === "/dashboard" || to === "/") {
      setCurrentPage("dashboard");
    }
  };

  if (currentPage === "register") {
    return (
      <VendorRegister 
        onSuccess={() => navigate("/dashboard")}
        onCancel={() => navigate("/dashboard")}
      />
    );
  }

  return <Dashboard navigate={navigate} />;
}