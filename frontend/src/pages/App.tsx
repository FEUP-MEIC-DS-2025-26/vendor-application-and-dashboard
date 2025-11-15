import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Dashboard from "./Dashboard";
import VendorRegister from "./VendorRegister";

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
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </SentryRoutes>
      </BrowserRouter>
    </Sentry.ErrorBoundary>
  );
}