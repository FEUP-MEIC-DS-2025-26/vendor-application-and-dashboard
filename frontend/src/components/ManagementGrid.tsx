import React from "react";
import { DashboardStats } from "../types/dashboard";

interface ManagementGridProps {
  stats: DashboardStats;
}

function ManagementGrid({ stats }: ManagementGridProps) {
  return (
    <section className="dashboard-section">
      <h2 className="section-title">Manage Your Shop</h2>
      <div className="management-grid">

        <button className="management-card" onClick={() => console.log('Products')}>
          <div className="management-icon" aria-hidden="true">🏺</div>
          <div className="management-content">
            <h3>Product Catalog</h3>
            <p>Manage your entire inventory ({stats.products.active_products} active)</p>
          </div>
        </button>

        <button className="management-card" onClick={() => console.log('Orders')}>
          <div className="management-icon" aria-hidden="true">📦</div>
          <div className="management-content">
            <h3>Order Management</h3>
            <p>View and process customer orders</p>
          </div>
        </button>

        <button className="management-card" onClick={() => console.log('Analytics')}>
          <div className="management-icon" aria-hidden="true">📊</div>
          <div className="management-content">
            <h3>Analytics</h3>
            <p>Track your sales performance</p>
          </div>
        </button>

        <button className="management-card" onClick={() => console.log('Settings')}>
          <div className="management-icon" aria-hidden="true">⚙️</div>
          <div className="management-content">
            <h3>Shop Settings</h3>
            <p>Configure your store preferences</p>
          </div>
        </button>

      </div>
    </section>
  );
}

export default ManagementGrid;
