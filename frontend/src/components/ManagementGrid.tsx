import React from "react";
import { DashboardStats } from "../types/dashboard";

interface ManagementGridProps {
  stats: DashboardStats;
  onAction?: (actionId: string) => void;
  hotkeys?: Record<string, string>;
  showHotkeys?: boolean;
}

function ManagementGrid({ stats, onAction, hotkeys = {}, showHotkeys = false }: ManagementGridProps) {
  return (
    <section className="dashboard-section">
      <h2 className="section-title">Manage Your Shop</h2>
      <div className="management-grid">
        <button className="management-card" onClick={() => (onAction ? onAction('catalog') : console.log('Products'))}>
          <div className="management-icon">🏺</div>
          <div className="management-content">
            <h3>Product Catalog {showHotkeys && hotkeys['catalog'] && <small className="hotkey">({hotkeys['catalog'].toUpperCase()})</small>}</h3>
            <p>Manage your entire inventory ({stats.products.active_products} active)</p>
          </div>
        </button>
        <button className="management-card" onClick={() => (onAction ? onAction('view_orders') : console.log('Orders'))}>
          <div className="management-icon">📦</div>
          <div className="management-content">
            <h3>Order Management {showHotkeys && hotkeys['view_orders'] && <small className="hotkey">({hotkeys['view_orders'].toUpperCase()})</small>}</h3>
            <p>View and process customer orders</p>
          </div>
        </button>
        <button className="management-card" onClick={() => (onAction ? onAction('analytics') : console.log('Analytics'))}>
          <div className="management-icon">📊</div>
          <div className="management-content">
            <h3>Analytics {showHotkeys && hotkeys['analytics'] && <small className="hotkey">({hotkeys['analytics'].toUpperCase()})</small>}</h3>
            <p>Track your sales performance</p>
          </div>
        </button>
        <button className="management-card" onClick={() => (onAction ? onAction('settings') : console.log('Settings'))}>
          <div className="management-icon">⚙️</div>
          <div className="management-content">
            <h3>Shop Settings {showHotkeys && hotkeys['settings'] && <small className="hotkey">({hotkeys['settings'].toUpperCase()})</small>}</h3>
            <p>Configure your store preferences</p>
          </div>
        </button>
      </div>
    </section>
  );
}

export default ManagementGrid;