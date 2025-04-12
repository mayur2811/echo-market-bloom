
package com.ecommerce.service;

import com.ecommerce.dto.WishlistItemDto;

import java.util.List;

public interface WishlistService {
    List<WishlistItemDto> getWishlistItems();
    WishlistItemDto addToWishlist(Long productId);
    void removeFromWishlist(Long productId);
    boolean isProductInWishlist(Long productId);
}
