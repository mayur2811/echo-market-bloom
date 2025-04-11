
// API base URL configuration
const API_BASE_URL = 'http://localhost:8080/api'; // Change this to your Spring Boot server URL

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  },
  
  // User endpoints
  USER: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
  },
  
  // Product endpoints
  PRODUCTS: {
    ALL: `${API_BASE_URL}/products`,
    DETAILS: (id) => `${API_BASE_URL}/products/${id}`,
    CREATE: `${API_BASE_URL}/products`,
    UPDATE: (id) => `${API_BASE_URL}/products/${id}`,
    DELETE: (id) => `${API_BASE_URL}/products/${id}`,
  },
  
  // Seller endpoints
  SELLER: {
    DASHBOARD: `${API_BASE_URL}/seller/dashboard`,
    PRODUCTS: `${API_BASE_URL}/seller/products`,
    SALES: `${API_BASE_URL}/seller/sales`,
  },
  
  // Cart endpoints
  CART: {
    ITEMS: `${API_BASE_URL}/cart`,
    ADD: `${API_BASE_URL}/cart/add`,
    UPDATE: `${API_BASE_URL}/cart/update`,
    REMOVE: `${API_BASE_URL}/cart/remove`,
  },
  
  // Order endpoints
  ORDERS: {
    CREATE: `${API_BASE_URL}/orders`,
    USER_ORDERS: `${API_BASE_URL}/orders/user`,
    DETAILS: (id) => `${API_BASE_URL}/orders/${id}`,
  },
};
