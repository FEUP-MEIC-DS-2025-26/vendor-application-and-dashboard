import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Dashboard from "./Dashboard";
import VendorRegister from "./VendorRegister";
import Inventory from "./Inventory";
import Orders from "./Orders";
import Analytics from "./Analytics";
import Settings from "./Settings";

// --- Integração com o Router ---
const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

export default function App() {
  return (
    // Envolvemos a App com o ErrorBoundary
    <Sentry.ErrorBoundary fallback={<p>Ocorreu um erro.</p>}>
      <BrowserRouter>
        {/* Usamos SentryRoutes em vez de Routes */}
        <SentryRoutes>
          <Route path="/dashboard" element={<Dashboard navigate={(to) => window.location.href = to} />} />
          <Route path="/register" element={<VendorRegister onSuccess={() => window.location.href = "/dashboard"} onCancel={() => window.location.href = "/dashboard"} />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </SentryRoutes>
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  );
}