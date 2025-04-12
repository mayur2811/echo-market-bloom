
// API base URL configuration
const API_BASE_URL = 'http://localhost:8080/api'; // Change this to your Spring Boot server URL

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    VALIDATE_RESET_TOKEN: `${API_BASE_URL}/auth/validate-reset-token`,
  },
  
  // User endpoints
  USER: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
  },
  
  // Product endpoints
  PRODUCTS: {
    ALL: `${API_BASE_URL}/products/all`,
    SEARCH: `${API_BASE_URL}/products/search`,
    FILTER: `${API_BASE_URL}/products/filter`,
    DETAILS: (id) => `${API_BASE_URL}/products/${id}`,
    CREATE: `${API_BASE_URL}/seller/products/add`,
    UPDATE: (id) => `${API_BASE_URL}/seller/products/${id}`,
    DELETE: (id) => `${API_BASE_URL}/seller/products/${id}`,
  },
  
  // Seller endpoints
  SELLER: {
    DASHBOARD: `${API_BASE_URL}/seller/dashboard`,
    PRODUCTS: `${API_BASE_URL}/seller/products`,
    SALES: `${API_BASE_URL}/seller/orders`,
  },
  
  // Cart endpoints
  CART: {
    ITEMS: `${API_BASE_URL}/cart`,
    ADD: `${API_BASE_URL}/cart/add`,
    UPDATE: `${API_BASE_URL}/cart/update`,
    REMOVE: `${API_BASE_URL}/cart/remove`,
    CLEAR: `${API_BASE_URL}/cart/clear`,
  },
  
  // Order endpoints
  ORDERS: {
    CREATE: `${API_BASE_URL}/orders`,
    BUYER_ORDERS: `${API_BASE_URL}/orders/buyer`,
    SELLER_ORDERS: `${API_BASE_URL}/orders/seller`,
    DETAILS: (id) => `${API_BASE_URL}/orders/${id}`,
  },
  
  // Payment endpoints
  PAYMENT: {
    CHECKOUT: `${API_BASE_URL}/payment/checkout`,
    VERIFY: `${API_BASE_URL}/payment/verify`,
  },
  
  // Notification endpoints
  NOTIFY: {
    ORDER: `${API_BASE_URL}/notify/order`,
  },
  
  // Wishlist endpoints
  WISHLIST: {
    ITEMS: `${API_BASE_URL}/wishlist`,
    ADD: `${API_BASE_URL}/wishlist/add`,
    REMOVE: `${API_BASE_URL}/wishlist/remove`,
  },
};
