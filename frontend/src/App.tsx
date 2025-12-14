import { useState } from "react";
import "./App.css";
import * as Sentry from "@sentry/react";
import Dashboard from "./pages/Dashboard";
import VendorRegister from "./pages/VendorRegister";
import { useTheme } from "./utils/theme";

const App = () => {
  const [view, setView] = useState<'dashboard' | 'register'>("dashboard");
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <Sentry.ErrorBoundary fallback={<p>Ocorreu um erro.</p>}>
      <div style={{ padding: 24 }}>
        <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setView("dashboard")}>Show Dashboard</button>
          <button onClick={() => setView("register")}>Show Register</button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Theme: {theme}
            </span>
            <button 
              onClick={toggleTheme}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '2px solid var(--accent)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.3s ease',
              }}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
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
