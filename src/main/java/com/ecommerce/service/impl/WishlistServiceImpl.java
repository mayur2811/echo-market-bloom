
package com.ecommerce.service.impl;

import com.ecommerce.dto.WishlistItemDto;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.entity.WishlistItem;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.WishlistItemRepository;
import com.ecommerce.security.UserDetailsImpl;
import com.ecommerce.service.UserService;
import com.ecommerce.service.WishlistService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {
    
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;
    
    @Override
    public List<WishlistItemDto> getWishlistItems() {
        User currentUser = getCurrentUser();
        List<WishlistItem> wishlistItems = wishlistItemRepository.findByUser(currentUser);
        
        return wishlistItems.stream()
                .map(this::mapToWishlistItemDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public WishlistItemDto addToWishlist(Long productId) {
        User currentUser = getCurrentUser();
        Product product = getProduct(productId);
        
        // Check if the product already exists in the wishlist
        if (wishlistItemRepository.existsByUserAndProductId(currentUser, productId)) {
            return wishlistItemRepository.findByUserAndProductId(currentUser, productId)
                    .map(this::mapToWishlistItemDto)
                    .orElse(null);
        }
        
        // Create new wishlist item
        WishlistItem wishlistItem = new WishlistItem();
        wishlistItem.setUser(currentUser);
        wishlistItem.setProduct(product);
        
        WishlistItem savedItem = wishlistItemRepository.save(wishlistItem);
        return mapToWishlistItemDto(savedItem);
    }
    
    @Override
    @Transactional
    public void removeFromWishlist(Long productId) {
        User currentUser = getCurrentUser();
        wishlistItemRepository.deleteByUserAndProductId(currentUser, productId);
    }
    
    @Override
    public boolean isProductInWishlist(Long productId) {
        User currentUser = getCurrentUser();
        return wishlistItemRepository.existsByUserAndProductId(currentUser, productId);
    }
    
    private WishlistItemDto mapToWishlistItemDto(WishlistItem wishlistItem) {
        WishlistItemDto dto = new WishlistItemDto();
        dto.setId(wishlistItem.getId());
        dto.setProductId(wishlistItem.getProduct().getId());
        dto.setName(wishlistItem.getProduct().getName());
        dto.setDescription(wishlistItem.getProduct().getDescription());
        dto.setPrice(wishlistItem.getProduct().getPrice());
        dto.setDiscountPrice(wishlistItem.getProduct().getDiscountPrice());
        dto.setImageUrl(wishlistItem.getProduct().getImageUrl());
        dto.setAddedAt(wishlistItem.getCreatedAt());
        return dto;
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userService.findById(userDetails.getId());
    }
    
    private Product getProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
    }
}
