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
   * Register a new vendor
   */
  async registerVendor(vendorData: any): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      console.log('📝 Submitting vendor registration...');
      
      const response = await fetch(`${API_BASE_URL}/vendors/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vendorData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      console.log('✅ Vendor registration successful:', data);
      return { success: true, data };

    } catch (error: any) {
      console.error('❌ Vendor registration failed:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to register vendor'
      };
    }
  }
}

export const dashboardAPI = new DashboardAPI();