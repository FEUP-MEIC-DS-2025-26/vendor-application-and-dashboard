import React from "react";
import { DashboardStats } from "../types/dashboard";

interface DashboardHeaderProps {
  storeInfo: {
    name: string;
    currency: string;
    timezone?: string;
  };
  stats: DashboardStats;
}

function DashboardHeader({ storeInfo, stats }: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div className="welcome-section">
        <h1>Welcome back, {storeInfo.name || 'Artisan'}!</h1>
        <p className="subtitle">Here's what's happening with your shop today</p>
      </div>
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.orders.new_orders}</div>
          <div className="stat-label">New Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.orders.currency}{stats.orders.monthly_revenue.toFixed(0)}</div>
          <div className="stat-label">This Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.products.total_products}</div>
          <div className="stat-label">Products</div>
        </div>
        {stats.products.low_stock_alerts > 0 && (
          <div className="stat-card warning">
            <div className="stat-number">{stats.products.low_stock_alerts}</div>
            <div className="stat-label">Low Stock</div>
          </div>
        )}
      </div>
    </header>
  );
}

export default DashboardHeader;