
import ApiService from './apiService';
import { API_ENDPOINTS } from '../config/apiConfig';

class WishlistService {
  static getWishlistItems() {
    return ApiService.get(API_ENDPOINTS.WISHLIST.ITEMS);
  }
  
  static addToWishlist(productId) {
    return ApiService.post(API_ENDPOINTS.WISHLIST.ADD, { productId });
  }
  
  static removeFromWishlist(productId) {
    return ApiService.delete(`${API_ENDPOINTS.WISHLIST.REMOVE}/${productId}`);
  }
  
  static isProductInWishlist(productId) {
    return ApiService.get(`${API_ENDPOINTS.WISHLIST.ITEMS}/${productId}/exists`)
      .then(response => response.data)
      .catch(() => false);
  }
}

export default WishlistService;
