import { RecentOrder } from "../types/dashboard";

interface RecentOrdersProps {
  orders: RecentOrder[];
  currency: string;
}

function RecentOrders({ orders, currency }: RecentOrdersProps) {
  return (
    <section className="dashboard-section">
      <h2 className="section-title">Recent Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-info">
              <div className="order-header">
                <strong>#{order.id}</strong>
                <span className={`status ${order.status}`}>{order.status}</span>
              </div>
              <div className="order-details">
                <span>{order.customer}</span>
                <span>{order.items_count} items</span>
                <span className="order-total">{currency}{order.total}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentOrders;