
import { API_ENDPOINTS } from '../config/apiConfig';
import { toast } from 'sonner';

class ApiService {
  // Get the JWT token from localStorage
  static getToken() {
    return localStorage.getItem('token');
  }
  
  // Headers with JWT token for authenticated requests
  static getAuthHeaders() {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }
  
  // Basic headers for non-authenticated requests
  static getBasicHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }
  
  // Common fetch wrapper with error handling
  static async fetchWithAuth(url, options) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getAuthHeaders(),
      });
      
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        // Try to refresh the token
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the original request with new token
          return this.fetchWithAuth(url, options);
        } else {
          // If refresh failed, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Session expired. Please log in again.');
        }
      }
      
      // Handle other error responses
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'An error occurred');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      toast.error(error.message || 'An error occurred');
      throw error;
    }
  }
  
  // Refresh token function
  static async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;
      
      const response = await fetch(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
        method: 'POST',
        headers: this.getBasicHeaders(),
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) return false;
      
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // GET request
  static async get(url) {
    return this.fetchWithAuth(url, { method: 'GET' });
  }
  
  // POST request
  static async post(url, data) {
    return this.fetchWithAuth(url, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  // PUT request
  static async put(url, data) {
    return this.fetchWithAuth(url, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  // DELETE request
  static async delete(url) {
    return this.fetchWithAuth(url, { method: 'DELETE' });
  }
}

export default ApiService;
