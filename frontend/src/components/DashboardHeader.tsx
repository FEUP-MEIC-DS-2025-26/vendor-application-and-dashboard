import React from "react";
import { DashboardStats } from "../types/dashboard";

interface DashboardHeaderProps {
  storeInfo: {
    name: string;
    currency: string;
    timezone?: string;
  };
  stats: DashboardStats;
  onRegister?: () => void;
  showHotkeys?: boolean;
  registerHotkey?: string;
}

function DashboardHeader({ storeInfo, stats, onRegister, showHotkeys = false, registerHotkey }: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <div className="welcome-section">
        <h1>Welcome back, {storeInfo.name || 'Artisan'}!</h1>
        <p className="subtitle">Here&#39;s what&#39;s happening with your shop today</p>
      </div>
      <div className="header-right">
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

        {/* Register CTA placed to the right of the header stats */}
        {onRegister && (
          <div className="header-actions">
            <button className="header-register-btn" onClick={onRegister}>
              📝 Register New Vendor {showHotkeys && registerHotkey && <small className="hotkey register">({registerHotkey.toUpperCase()})</small>}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default DashboardHeader;