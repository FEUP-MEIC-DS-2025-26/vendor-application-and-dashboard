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
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  storeInfo,
  stats,
  onRegister,
}) => {
  return (
    <header
      className="dashboard-header"
      aria-labelledby="dashboard-heading"
    >
      <div className="welcome-section">
        {/* Main heading for screen readers */}
        <h1 id="dashboard-heading">
          Welcome back, {storeInfo.name || "Artisan"}!
        </h1>

        <p className="subtitle" aria-live="polite">
          Here&apos;s what&apos;s happening with your shop today
        </p>
      </div>

      <div className="header-right">
        {/* Group the stats for assistive technologies */}
        <div
          className="quick-stats"
          role="group"
          aria-label="Quick statistics for your shop"
        >
          {/* New Orders */}
          <div
            className="stat-card"
            role="group"
            aria-label="New orders"
          >
            <div className="stat-number">
              {stats.orders.new_orders}
            </div>
            <div className="stat-label">New Orders</div>
          </div>

          {/* Monthly Revenue */}
          <div
            className="stat-card"
            role="group"
            aria-label="Monthly revenue"
          >
            <div className="stat-number">
              {stats.orders.currency}
              {stats.orders.monthly_revenue.toFixed(0)}
            </div>
            <div className="stat-label">This Month</div>
          </div>

          {/* Total Products */}
          <div
            className="stat-card"
            role="group"
            aria-label="Total products"
          >
            <div className="stat-number">
              {stats.products.total_products}
            </div>
            <div className="stat-label">Products</div>
          </div>

          {/* Low Stock Alerts */}
          {stats.products.low_stock_alerts > 0 && (
            <div
              className="stat-card warning"
              role="group"
              aria-label="Low stock alerts"
            >
              <div className="stat-number">
                {stats.products.low_stock_alerts}
              </div>
              <div className="stat-label">Low Stock</div>
            </div>
          )}
        </div>

        {/* Action Button */}
        {onRegister && (
          <div className="header-actions">
            <button
              className="header-register-btn"
              onClick={onRegister}
              aria-label="Register a new vendor"
            >
              {/* Prevent screen readers from announcing emoji */}
              <span aria-hidden="true">📝</span> Register New Vendor
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;