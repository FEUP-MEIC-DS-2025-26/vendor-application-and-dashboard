import { DashboardData } from "../types/dashboard";
import { api } from "../services/client";

class DashboardAPI {
  /**
   * Fetch all dashboard data in a single call
   */
  async getDashboardData(): Promise<DashboardData> {
    try {
      console.log("🔍 Attempting to fetch dashboard data...");
      const { data } = await api.get<DashboardData>("/dashboard");

      console.log("✅ Dashboard data received:", data);
      return data;
    } catch (error: any) {
      console.error("❌ Failed to fetch dashboard data:", error.message);

      // Return a fallback object to prevent crashes
      const fallbackData = this.getFallbackDashboard();
      fallbackData.error = error.message || "Unable to fetch dashboard data";
      return fallbackData;
    }
  }

  /**
   * Check backend & Jumpseller API health
   */
  async checkHealth(): Promise<{ backend: boolean; jumpseller: boolean }> {
    try {
      const [backend, jumpseller] = await Promise.all([
        api.get("/../health").then(() => true).catch(() => false),
        api.get("/jumpseller/health").then(() => true).catch(() => false),
      ]);

      return { backend, jumpseller };
    } catch (error) {
      console.error("❌ Health check failed:", error);
      return { backend: false, jumpseller: false };
    }
  }

  /**
   * Register a new vendor
   */
  async registerVendor(vendorData: any): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      console.log("📝 Submitting vendor registration...");
      const { data } = await api.post("/vendors/register", vendorData);

      console.log("✅ Vendor registration successful:", data);
      return { success: true, data };
    } catch (error: any) {
      console.error("❌ Vendor registration failed:", error.message);
      return {
        success: false,
        error: error.response?.data?.detail || error.message || "Failed to register vendor",
      };
    }
  }

  /**
   * Fallback dashboard data (offline mode)
   */
  private getFallbackDashboard(): DashboardData {
    return {
      success: false,
      error: "Unable to connect to backend API",
      timestamp: new Date().toISOString(),
      store_info: { name: "Your Artisan Store", currency: "EUR" },
      stats: {
        orders: { new_orders: 1, total_orders: 2, monthly_revenue: 135.49, currency: "EUR" },
        products: { total_products: 3, active_products: 3, low_stock_alerts: 1 },
      },
      recent_orders: [
        { id: 1, customer: "Jane Smith", total: 89.99, status: "pending", date: "2025-10-26", items_count: 2 },
        { id: 2, customer: "John Doe", total: 45.5, status: "completed", date: "2025-10-25", items_count: 1 },
      ],
      quick_actions: [
        { id: "add_product", title: "Suggest a product", description: "Suggest a new product for the marketplace", icon: "➕", action: "create_product" },
        { id: "view_orders", title: "Manage Orders", description: "View and update order status", icon: "📦", action: "view_orders" },
        { id: "inventory", title: "Check Inventory", description: "Monitor stock levels", icon: "📊", action: "view_inventory" },
        { id: "analytics", title: "Sales Analytics", description: "View performance metrics", icon: "📈", action: "view_analytics" },
      ],
    };
  }
}

export const dashboardAPI = new DashboardAPI();
