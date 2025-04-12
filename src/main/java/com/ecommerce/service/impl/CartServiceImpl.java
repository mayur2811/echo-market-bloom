
package com.ecommerce.service.impl;

import com.ecommerce.dto.CartItemDto;
import com.ecommerce.dto.CartItemRequest;
import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.security.UserDetailsImpl;
import com.ecommerce.service.CartService;
import com.ecommerce.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    
    @Override
    public List<CartItemDto> getCartItems() {
        User currentUser = getCurrentUser();
        List<CartItem> cartItems = cartItemRepository.findByUser(currentUser);
        
        return cartItems.stream()
                .map(this::mapToCartItemDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public CartItemDto addToCart(CartItemRequest cartItemRequest) {
        User currentUser = getCurrentUser();
        Product product = getProduct(cartItemRequest.getProductId());
        
        // Check if the product already exists in the cart
        Optional<CartItem> existingCartItem = cartItemRepository.findByUserAndProductId(currentUser, product.getId());
        
        CartItem cartItem;
        if (existingCartItem.isPresent()) {
            // Update the quantity
            cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + cartItemRequest.getQuantity());
        } else {
            // Create new cart item
            cartItem = new CartItem();
            cartItem.setUser(currentUser);
            cartItem.setProduct(product);
            cartItem.setQuantity(cartItemRequest.getQuantity());
        }
        
        // Update the selected size if provided
        if (cartItemRequest.getSelectedSize() != null) {
            cartItem.setSelectedSize(cartItemRequest.getSelectedSize());
        }
        
        CartItem savedCartItem = cartItemRepository.save(cartItem);
        return mapToCartItemDto(savedCartItem);
    }
    
    @Override
    @Transactional
    public CartItemDto updateCartItem(CartItemRequest cartItemRequest) {
        User currentUser = getCurrentUser();
        
        CartItem cartItem = cartItemRepository.findByUserAndProductId(currentUser, cartItemRequest.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        // Update quantity
        cartItem.setQuantity(cartItemRequest.getQuantity());
        
        // Update size if provided
        if (cartItemRequest.getSelectedSize() != null) {
            cartItem.setSelectedSize(cartItemRequest.getSelectedSize());
        }
        
        CartItem updatedCartItem = cartItemRepository.save(cartItem);
        return mapToCartItemDto(updatedCartItem);
    }
    
    @Override
    @Transactional
    public void removeFromCart(Long productId) {
        User currentUser = getCurrentUser();
        cartItemRepository.deleteByUserAndProductId(currentUser, productId);
    }
    
    @Override
    @Transactional
    public void clearCart() {
        User currentUser = getCurrentUser();
        cartItemRepository.deleteByUser(currentUser);
    }
    
    private CartItemDto mapToCartItemDto(CartItem cartItem) {
        CartItemDto dto = new CartItemDto();
        dto.setId(cartItem.getId());
        dto.setProductId(cartItem.getProduct().getId());
        dto.setName(cartItem.getProduct().getName());
        dto.setImage(cartItem.getProduct().getImageUrl());
        dto.setPrice(cartItem.getProduct().getPrice());
        dto.setDiscountPrice(cartItem.getProduct().getDiscountPrice());
        dto.setQuantity(cartItem.getQuantity());
        dto.setSelectedSize(cartItem.getSelectedSize());
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
