
import { API_ENDPOINTS } from '../config/apiConfig';
import ApiService from './apiService';

class CartService {
  static async getCartItems() {
    return ApiService.get(API_ENDPOINTS.CART.ITEMS);
  }
  
  static async addToCart(productId, quantity) {
    return ApiService.post(API_ENDPOINTS.CART.ADD, { productId, quantity });
  }
  
  static async updateCartItem(itemId, quantity) {
    return ApiService.put(API_ENDPOINTS.CART.UPDATE, { itemId, quantity });
  }
  
  static async removeFromCart(itemId) {
    return ApiService.delete(`${API_ENDPOINTS.CART.REMOVE}/${itemId}`);
  }
  
  static async clearCart() {
    return ApiService.delete(API_ENDPOINTS.CART.ITEMS);
  }
}

export default CartService;
