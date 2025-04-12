
import { API_ENDPOINTS } from '../config/apiConfig';
import ApiService from './apiService';

class WishlistService {
  static async getWishlistItems() {
    return ApiService.get(API_ENDPOINTS.WISHLIST.ITEMS);
  }
  
  static async addToWishlist(productId) {
    return ApiService.post(API_ENDPOINTS.WISHLIST.ADD, { productId });
  }
  
  static async removeFromWishlist(productId) {
    return ApiService.delete(`${API_ENDPOINTS.WISHLIST.REMOVE}/${productId}`);
  }
}

export default WishlistService;
