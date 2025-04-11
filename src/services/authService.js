
import { API_ENDPOINTS } from '../config/apiConfig';
import ApiService from './apiService';
import { jwtDecode } from 'jwt-decode';

class AuthService {
  static async login(email, password, userType) {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: ApiService.getBasicHeaders(),
        body: JSON.stringify({ email, password, userType }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid credentials');
      }
      
      const data = await response.json();
      
      // Store tokens and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data.user;
    } catch (error) {
      throw error;
    }
  }
  
  static async register(userData, userType) {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        headers: ApiService.getBasicHeaders(),
        body: JSON.stringify({ ...userData, userType }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      
      const data = await response.json();
      
      // Store tokens and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data.user;
    } catch (error) {
      throw error;
    }
  }
  
  static async logout() {
    try {
      // Call backend logout endpoint if needed
      await ApiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clean up local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
  
  static async getUserProfile() {
    return ApiService.get(API_ENDPOINTS.USER.PROFILE);
  }
  
  static async updateProfile(userData) {
    return ApiService.put(API_ENDPOINTS.USER.UPDATE_PROFILE, userData);
  }
  
  static isTokenValid(token) {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
  
  static getUserFromLocalStorage() {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    
    try {
      return JSON.parse(userString);
    } catch (error) {
      return null;
    }
  }
}

export default AuthService;
