import { DashboardData } from '../types/dashboard';

// API service for dashboard data
const API_BASE_URL = 'http://localhost:8000/api';

class DashboardAPI {
  /**
   * Fetch all dashboard data in a single call
   */
  async getDashboardData(): Promise<DashboardData> {
    try {
      console.log('🔍 Attempting to fetch dashboard data from:', `${API_BASE_URL}/dashboard`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Backend API error: HTTP ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Dashboard data received:', data);
      return data;
      
    } catch (error: any) {
      console.error('❌ Failed to fetch dashboard data:', error);
      
      let errorMessage = 'Unknown error occurred';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout - backend may not be running';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Cannot connect to backend server at http://localhost:8000';
      } else {
        errorMessage = error.message;
      }
      
      console.log('🔄 Returning fallback data due to error:', errorMessage);
      
      // Return fallback data with error info
      const fallbackData = this.getFallbackDashboard();
      fallbackData.error = errorMessage;
      return fallbackData;
    }
  }

  /**
   * Check if backend and Jumpseller API are working
   */
  async checkHealth(): Promise<{ backend: boolean; jumpseller: boolean }> {
    try {
      const [backendResponse, jumpsellerResponse] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/../health`),
        fetch(`${API_BASE_URL}/jumpseller/health`)
      ]);

      return {
        backend: backendResponse.status === 'fulfilled' && backendResponse.value.ok,
        jumpseller: jumpsellerResponse.status === 'fulfilled' && jumpsellerResponse.value.ok
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return { backend: false, jumpseller: false };
    }
  }

  /**
   * Fallback dashboard data when API is unavailable
   */
  private getFallbackDashboard(): DashboardData {
    return {
      success: false,
      error: "Unable to connect to backend API",
      timestamp: new Date().toISOString(),
      store_info: {
        name: "Your Artisan Store",
        currency: "EUR"
      },
      stats: {
        orders: {
          new_orders: 1,
          total_orders: 2,
          monthly_revenue: 135.49,
          currency: "EUR"
        },
        products: {
          total_products: 3,
          active_products: 3,
          low_stock_alerts: 1
        }
      },
      recent_orders: [
            { id: 1, customer: "Jane Smith", total: 89.99, status: "pending", date: "2025-10-26", items_count: 2 },
            { id: 2, customer: "John Doe", total: 45.50, status: "completed", date: "2025-10-25", items_count: 1 }
        ],
      quick_actions: [
        {
          id: "add_product",
          title: "Add New Product",
          description: "Create and list a new product",
          icon: "➕",
          action: "create_product"
        },
        {
          id: "view_orders",
          title: "Manage Orders", 
          description: "View and update order status",
          icon: "📦",
          action: "view_orders"
        },
        {
          id: "inventory",
          title: "Check Inventory",
          description: "Monitor stock levels", 
          icon: "📊",
          action: "view_inventory"
        },
        {
          id: "analytics",
          title: "Sales Analytics",
          description: "View performance metrics",
          icon: "📈", 
          action: "view_analytics"
        }
      ]
    };
  }
}

export const dashboardAPI = new DashboardAPI();