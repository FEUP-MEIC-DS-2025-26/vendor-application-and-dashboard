import React from "react"
import { createRoot } from "react-dom/client"
import App from "./pages/App"
import "./styles/styles.css"
import * as Sentry from "@sentry/react";

// --- Sentry Initialization ---
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
// -----------------------------

const container = document.getElementById("root")!
const root = createRoot(container)
root.render(<App />)