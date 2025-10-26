import React from "react";
import Dashboard from "./Dashboard";

export default function App() {
  const navigate = (to: string) => {
    window.location.href = to;
  };

  return <Dashboard navigate={navigate} />;
}