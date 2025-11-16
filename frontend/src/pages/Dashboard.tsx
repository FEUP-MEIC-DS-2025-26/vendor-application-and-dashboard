import React, { useState, useEffect } from "react";
import * as Sentry from "@sentry/react";
import { dashboardAPI } from "../services/dashboardAPI";
import { DashboardData } from "../types/dashboard";
import LoadingScreen from "../components/LoadingScreen";
import ErrorScreen from "../components/ErrorScreen";
import DashboardHeader from "../components/DashboardHeader";
import QuickActions from "../components/QuickActions";
import RecentOrders from "../components/RecentOrders";
import ManagementGrid from "../components/ManagementGrid";

interface DashboardProps {
  navigate: (to: string) => void;
}

function Dashboard({ navigate }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    // Add a timeout to prevent infinite loading
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout - is the backend running?')), 10000)
    );
    
    try {
      const dataPromise = dashboardAPI.getDashboardData();
      const data = await Promise.race([dataPromise, timeoutPromise]) as DashboardData;
      
      setDashboardData(data);
      
      if (!data.success && data.error) {
        setError(data.error);
      }
    } catch (err: unknown) {
      // Narrow the unknown error before accessing properties
      let errorMessage = "Failed to load dashboard data";

      if (err instanceof Error) {
        if (err.message.includes('timeout')) {
          errorMessage =
            "Backend server is not running. Please start it with: uvicorn app.main:app --reload";
        }
      } else if (typeof err === 'string' && err.includes('timeout')) {
        errorMessage =
          "Backend server is not running. Please start it with: uvicorn app.main:app --reload";
      }

      setError(errorMessage);
      console.error("Dashboard load error:", err);
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Sentry Test Functions (Commented out - only for testing) ---
  // const testSentryError = () => {
  //   throw new Error("Sentry Test Error from Frontend");
  // };
  //
  // const testSentryMessage = () => {
  //   Sentry.captureMessage("Sentry Test Message from Frontend", "info");
  //   alert("Test message sent to Sentry!");
  // };
  // ----------------------------

  if (loading) {
    return <LoadingScreen />;
  }

  if (!dashboardData) {
    return <ErrorScreen error={error} onRetry={loadDashboardData} />;
  }

  // If the backend is unreachable we return a special fallback with error === 'ERROR'.
  // In that case show the full-page ErrorScreen instead of rendering cached data.
  if (dashboardData && dashboardData.error === 'ERROR') {
    return <ErrorScreen error={dashboardData.error} onRetry={loadDashboardData} />;
  }

  const { store_info, stats, recent_orders, quick_actions } = dashboardData;
  console.log('Dashboard Data:', dashboardData);

  return (
    <div className="container">
      {error && (
        <div className="error-banner">
          ⚠️ {error} - Showing cached data
          <button onClick={loadDashboardData} className="refresh-btn">Refresh</button>
        </div>
      )}
      
      {/* --- Sentry Test Buttons (Commented out - only for testing) --- */}
      {/* 
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button 
          onClick={testSentryError} 
          style={{ 
            padding: "10px 15px", 
            backgroundColor: "#ff4444", 
            color: "white", 
            border: "none", 
            cursor: "pointer",
            borderRadius: "4px",
            fontSize: "12px"
          }}
        >
          Test Sentry Error
        </button>
        <button 
          onClick={testSentryMessage} 
          style={{ 
            padding: "10px 15px", 
            backgroundColor: "#4444ff", 
            color: "white", 
            border: "none", 
            cursor: "pointer",
            borderRadius: "4px",
            fontSize: "12px"
          }}
        >
          Test Sentry Message
        </button>
      </div>
      */}
      {/* --- End Sentry Test Buttons --- */}
      
      <DashboardHeader 
        storeInfo={store_info} 
        stats={stats} 
        onRegister={() => navigate("/register")}
      />

      <main className="dashboard-main">
        <QuickActions actions={quick_actions} />
        
        {recent_orders.length > 0 && (
          <RecentOrders 
            orders={recent_orders} 
            currency={store_info.currency} 
          />
        )}
        
        <ManagementGrid stats={stats} />
      </main>

      <footer>
        <small>
          Your artisan marketplace dashboard - Last updated: {new Date(dashboardData.timestamp).toLocaleTimeString()}
          {!dashboardData.success && <span className="offline-indicator"> (Offline Mode)</span>}
        </small>
      </footer>
    </div>
  );
}

export default Dashboard;