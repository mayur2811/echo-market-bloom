
import { API_ENDPOINTS } from '../config/apiConfig';
import ApiService from './apiService';

class CartService {
  static async getCartItems() {
    return ApiService.get(API_ENDPOINTS.CART.ITEMS);
  }
  
  static async addToCart(productId, quantity) {
    return ApiService.post(API_ENDPOINTS.CART.ADD, { productId, quantity });
  }
  
  static async updateCartItem(productId, quantity) {
    return ApiService.put(API_ENDPOINTS.CART.UPDATE, { productId, quantity });
  }
  
  static async removeFromCart(productId) {
    return ApiService.delete(`${API_ENDPOINTS.CART.REMOVE}/${productId}`);
  }
  
  static async clearCart() {
    return ApiService.delete(API_ENDPOINTS.CART.CLEAR);
  }
}

export default CartService;
