
import { API_ENDPOINTS } from '../config/apiConfig';
import ApiService from './apiService';

class SellerService {
  static async getDashboardData() {
    return ApiService.get(API_ENDPOINTS.SELLER.DASHBOARD);
  }
  
  static async getSellerProducts() {
    return ApiService.get(API_ENDPOINTS.SELLER.PRODUCTS);
  }
  
  static async getSalesData() {
    return ApiService.get(API_ENDPOINTS.SELLER.SALES);
  }
}

export default SellerService;
