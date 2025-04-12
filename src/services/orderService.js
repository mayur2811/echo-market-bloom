
import { API_ENDPOINTS } from '../config/apiConfig';
import ApiService from './apiService';

class OrderService {
  static async createOrder(orderData) {
    return ApiService.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
  }
  
  static async getUserOrders() {
    return ApiService.get(API_ENDPOINTS.ORDERS.BUYER_ORDERS);
  }
  
  static async getOrderDetails(orderId) {
    return ApiService.get(API_ENDPOINTS.ORDERS.DETAILS(orderId));
  }
  
  static async getSellerOrders() {
    return ApiService.get(API_ENDPOINTS.ORDERS.SELLER_ORDERS);
  }
  
  static async updateOrderStatus(orderId, status) {
    return ApiService.put(`${API_ENDPOINTS.ORDERS.DETAILS(orderId)}/status`, { status });
  }
}

export default OrderService;
