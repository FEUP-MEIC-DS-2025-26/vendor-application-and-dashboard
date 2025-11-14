import React, { useState, useEffect } from "react";
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
    } catch (err: any) {
      const errorMessage = err.message.includes('timeout') 
        ? "Backend server is not running. Please start it with: uvicorn app.main:app --reload"
        : "Failed to load dashboard data";
      
      setError(errorMessage);
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

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