
package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.CartItemDto;
import com.ecommerce.dto.CartItemRequest;
import com.ecommerce.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {
    
    private final CartService cartService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<CartItemDto>>> getCartItems() {
        List<CartItemDto> cartItems = cartService.getCartItems();
        
        return ResponseEntity.ok(
                ApiResponse.<List<CartItemDto>>builder()
                        .success(true)
                        .message("Cart items fetched successfully")
                        .data(cartItems)
                        .build()
        );
    }
    
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartItemDto>> addToCart(@Valid @RequestBody CartItemRequest cartItemRequest) {
        CartItemDto cartItem = cartService.addToCart(cartItemRequest);
        
        return ResponseEntity.ok(
                ApiResponse.<CartItemDto>builder()
                        .success(true)
                        .message("Item added to cart successfully")
                        .data(cartItem)
                        .build()
        );
    }
    
    @PutMapping("/update")
    public ResponseEntity<ApiResponse<CartItemDto>> updateCartItem(@Valid @RequestBody CartItemRequest cartItemRequest) {
        CartItemDto cartItem = cartService.updateCartItem(cartItemRequest);
        
        return ResponseEntity.ok(
                ApiResponse.<CartItemDto>builder()
                        .success(true)
                        .message("Cart item updated successfully")
                        .data(cartItem)
                        .build()
        );
    }
    
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeFromCart(@PathVariable Long productId) {
        cartService.removeFromCart(productId);
        
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Item removed from cart successfully")
                        .build()
        );
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<ApiResponse<Void>> clearCart() {
        cartService.clearCart();
        
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Cart cleared successfully")
                        .build()
        );
    }
}
