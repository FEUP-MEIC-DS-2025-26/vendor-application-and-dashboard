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
import SalesChart from "../components/SalesChart";

interface DashboardProps {
  navigate: (to: string) => void;
}

function Dashboard({ navigate }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // NEW: State for time period
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    loadDashboardData(period);
  }, [period]); // Reload when period changes

  const loadDashboardData = async (currentPeriod: string) => {
    setLoading(true);
    setError(null);
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout - is the backend running?')), 10000)
    );
    
    try {
      // Pass currentPeriod to the API call
      const dataPromise = dashboardAPI.getDashboardData(currentPeriod);
      const data = await Promise.race([dataPromise, timeoutPromise]) as DashboardData;
      
      setDashboardData(data);
      
      if (!data.success && data.error) {
        setError(data.error);
      }
    } catch (err: unknown) {
      let errorMessage = "Failed to load dashboard data";
      if (err instanceof Error) {
        if (err.message.includes('timeout')) {
          errorMessage = "Backend server is not running. Please start it with: uvicorn app.main:app --reload";
        }
      } else if (typeof err === 'string' && err.includes('timeout')) {
        errorMessage = "Backend server is not running. Please start it with: uvicorn app.main:app --reload";
      }
      setError(errorMessage);
      console.error("Dashboard load error:", err);
      Sentry.captureException(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!dashboardData) {
    return <ErrorScreen error={error} onRetry={() => loadDashboardData(period)} />;
  }

  if (dashboardData && dashboardData.error === 'ERROR') {
    return <ErrorScreen error={dashboardData.error} onRetry={() => loadDashboardData(period)} />;
  }

  const { store_info, stats, recent_orders, quick_actions, sales_chart } = dashboardData;

  return (
    <div className="container">
      {error && (
        <div className="error-banner">
          ⚠️ {error} - Showing cached data
          <button onClick={() => loadDashboardData(period)} className="refresh-btn">Refresh</button>
        </div>
      )}
      
      <DashboardHeader 
        storeInfo={store_info} 
        stats={stats} 
        onRegister={() => navigate("/register")}
      />

      <main className="dashboard-main">
        <QuickActions actions={quick_actions} />
        
        {/* NEW: Period Selection UI */}
        <div style={{ 
          display: "flex", 
          justifyContent: "flex-end", 
          gap: "10px", 
          marginBottom: "-20px", 
          zIndex: 10, 
          position: "relative" 
        }}>
          {(["daily", "weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid #8b5a3c",
                background: period === p ? "#8b5a3c" : "white",
                color: period === p ? "white" : "#8b5a3c",
                cursor: "pointer",
                textTransform: "capitalize",
                fontWeight: "600",
                fontSize: "0.9rem"
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {sales_chart && sales_chart.length > 0 && (
          <SalesChart 
            data={sales_chart} 
            currency={store_info.currency} 
          />
        )}
        
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