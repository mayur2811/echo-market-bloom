
package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.WishlistItemDto;
import com.ecommerce.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    
    private final WishlistService wishlistService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistItemDto>>> getWishlistItems() {
        List<WishlistItemDto> wishlistItems = wishlistService.getWishlistItems();
        
        return ResponseEntity.ok(
                ApiResponse.<List<WishlistItemDto>>builder()
                        .success(true)
                        .message("Wishlist items fetched successfully")
                        .data(wishlistItems)
                        .build()
        );
    }
    
    @PostMapping("/add")
    public ResponseEntity<ApiResponse<WishlistItemDto>> addToWishlist(@RequestBody Long productId) {
        WishlistItemDto wishlistItem = wishlistService.addToWishlist(productId);
        
        return ResponseEntity.ok(
                ApiResponse.<WishlistItemDto>builder()
                        .success(true)
                        .message("Item added to wishlist successfully")
                        .data(wishlistItem)
                        .build()
        );
    }
    
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeFromWishlist(@PathVariable Long productId) {
        wishlistService.removeFromWishlist(productId);
        
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Item removed from wishlist successfully")
                        .build()
        );
    }
    
    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Boolean>> isProductInWishlist(@PathVariable Long productId) {
        boolean isInWishlist = wishlistService.isProductInWishlist(productId);
        
        return ResponseEntity.ok(
                ApiResponse.<Boolean>builder()
                        .success(true)
                        .data(isInWishlist)
                        .build()
        );
    }
}
