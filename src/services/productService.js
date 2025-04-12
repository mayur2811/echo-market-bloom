
import { API_ENDPOINTS } from '../config/apiConfig';
import ApiService from './apiService';

class ProductService {
  static async getAllProducts(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${API_ENDPOINTS.PRODUCTS.ALL}?${queryParams}`;
    return ApiService.get(url);
  }
  
  static async searchProducts(query) {
    return ApiService.get(`${API_ENDPOINTS.PRODUCTS.SEARCH}?name=${encodeURIComponent(query)}`);
  }
  
  static async filterProducts(filterParams) {
    const queryParams = new URLSearchParams(filterParams).toString();
    return ApiService.get(`${API_ENDPOINTS.PRODUCTS.FILTER}?${queryParams}`);
  }
  
  static async getProductById(id) {
    return ApiService.get(API_ENDPOINTS.PRODUCTS.DETAILS(id));
  }
  
  static async createProduct(productData) {
    return ApiService.post(API_ENDPOINTS.PRODUCTS.CREATE, productData);
  }
  
  static async updateProduct(id, productData) {
    return ApiService.put(API_ENDPOINTS.PRODUCTS.UPDATE(id), productData);
  }
  
  static async deleteProduct(id) {
    return ApiService.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
  }
  
  static async getSellerProducts() {
    return ApiService.get(API_ENDPOINTS.SELLER.PRODUCTS);
  }
}

export default ProductService;
