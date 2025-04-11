
import { API_ENDPOINTS } from '../config/apiConfig';
import ApiService from './apiService';

class OrderService {
  static async createOrder(orderData) {
    return ApiService.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
  }
  
  static async getUserOrders() {
    return ApiService.get(API_ENDPOINTS.ORDERS.USER_ORDERS);
  }
  
  static async getOrderDetails(orderId) {
    return ApiService.get(API_ENDPOINTS.ORDERS.DETAILS(orderId));
  }
}

export default OrderService;
