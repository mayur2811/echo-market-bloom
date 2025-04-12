
package com.ecommerce.service;

import com.ecommerce.dto.CartItemDto;
import com.ecommerce.dto.CartItemRequest;

import java.util.List;

public interface CartService {
    List<CartItemDto> getCartItems();
    CartItemDto addToCart(CartItemRequest cartItemRequest);
    CartItemDto updateCartItem(CartItemRequest cartItemRequest);
    void removeFromCart(Long productId);
    void clearCart();
}
