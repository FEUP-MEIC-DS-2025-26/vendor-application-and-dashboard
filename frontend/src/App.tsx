import React, { useState } from "react";
import "./App.css";
import * as Sentry from "@sentry/react";
import Dashboard from "./pages/Dashboard";
import VendorRegister from "./pages/VendorRegister";

const App = () => {
  const [view, setView] = useState<'dashboard' | 'register'>("dashboard");

  return (
    <Sentry.ErrorBoundary fallback={<p>Ocorreu um erro.</p>}>
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <button onClick={() => setView("dashboard")}>Show Dashboard</button>
          <button onClick={() => setView("register")} style={{ marginLeft: 8 }}>Show Register</button>
        </div>
        {view === "dashboard" ? (
          <Dashboard />
        ) : (
          <VendorRegister onSuccess={() => setView("dashboard")}
                         onCancel={() => setView("dashboard")} />
        )}
      </div>
    </Sentry.ErrorBoundary>
  );
};

export default App;
