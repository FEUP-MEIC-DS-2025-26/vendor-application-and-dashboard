export interface DashboardStats {
  orders: {
    new_orders: number;
    total_orders: number;
    monthly_revenue: number;
    currency: string;
  };
  products: {
    total_products: number;
    active_products: number;
    low_stock_alerts: number;
  };
}

export interface RecentOrder {
  id: number;
  customer: string;
  total: number;
  status: string;
  date: string;
  items_count: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: string;
}

// NEW: Interface for chart data
export interface SalesDataPoint {
  date: string;
  sales: number;
}

export interface DashboardData {
  success: boolean;
  timestamp: string;
  store_info: {
    name: string;
    currency: string;
    timezone?: string;
  };
  stats: DashboardStats;
  recent_orders: RecentOrder[];
  // NEW: Array of sales data points
  sales_chart: SalesDataPoint[];
  quick_actions: QuickAction[];
  error?: string;
}