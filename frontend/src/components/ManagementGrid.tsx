import { DashboardStats } from "../types/dashboard";

interface ManagementGridProps {
  stats: DashboardStats;
  onAction?: (actionId: string) => void;
  hotkeys?: Record<string, string>;
  showHotkeys?: boolean;
}

function ManagementGrid({ onAction, hotkeys = {}, showHotkeys = false }: ManagementGridProps) {
  return (
    <section className="dashboard-section">
      <h2 className="section-title">Manage Your Shop</h2>
      <div className="management-grid">

        <button className="management-card" onClick={() => (onAction ? onAction('catalog') : console.log('Products'))}>
          <div className="management-icon" aria-hidden="true">🏺</div>
          <div className="management-content">
            <h3>Product Catalog {showHotkeys && hotkeys['catalog'] && <small className="hotkey">({hotkeys['catalog'].toUpperCase()})</small>}</h3>
            <p>Manage your entire inventory</p>
          </div>
        </button>
        <button className="management-card" onClick={() => (onAction ? onAction('view_orders') : console.log('Orders'))}>
          <div className="management-icon">📦</div>
          <div className="management-content">
            <h3>Order Management {showHotkeys && hotkeys['view_orders'] && <small className="hotkey">({hotkeys['view_orders'].toUpperCase()})</small>}</h3>
            <p>View and process customer orders</p>
          </div>
        </button>

        <button className="management-card" onClick={() => (onAction ? onAction('leaderboard') : console.log('Leaderboard'))}>
          <div className="management-icon" aria-hidden="true">🏆</div>
          <div className="management-content">
            <h3>Products Leaderboard {showHotkeys && hotkeys['leaderboard'] && <small className="hotkey">({hotkeys['leaderboard'].toUpperCase()})</small>}</h3>
            <p>View top performing products</p>
          </div>
        </button>

        <button className="management-card" onClick={() => (onAction ? onAction('reviews') : console.log('Reviews'))}>
          <div className="management-icon" aria-hidden="true">⭐</div>
          <div className="management-content">
            <h3>Products Reviews {showHotkeys && hotkeys['reviews'] && <small className="hotkey">({hotkeys['reviews'].toUpperCase()})</small>}</h3>
            <p>Read customer feedback and ratings</p>
          </div>
        </button>

      </div>
    </section>
  );
}

export default ManagementGrid;

