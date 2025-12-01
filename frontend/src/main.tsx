import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import "./styles/styles.css"
import * as Sentry from "@sentry/react";

// --- Sentry Initialization ---
Sentry.init({
  // dsn: import.meta.env.VITE_SENTRY_DSN,
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
console.log("MAIN TSX LOADED");
const container = document.getElementById("root")!
const root = createRoot(container)
root.render(<div>Hello World</div>);
root.render(<App />)