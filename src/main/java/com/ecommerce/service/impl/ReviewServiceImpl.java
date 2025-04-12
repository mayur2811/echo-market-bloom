
package com.ecommerce.service.impl;

import com.ecommerce.dto.ReviewDto;
import com.ecommerce.dto.ReviewRequest;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.Review;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ReviewRepository;
import com.ecommerce.security.UserDetailsImpl;
import com.ecommerce.service.ReviewService;
import com.ecommerce.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;
    
    @Override
    @Transactional
    public ReviewDto addReview(ReviewRequest reviewRequest) {
        User currentUser = getCurrentUser();
        Product product = getProduct(reviewRequest.getProductId());
        
        // Check if the user has already reviewed this product
        Optional<Review> existingReview = reviewRepository.findByUserIdAndProductId(currentUser.getId(), product.getId());
        
        Review review;
        if (existingReview.isPresent()) {
            // Update existing review
            review = existingReview.get();
            review.setRating(reviewRequest.getRating());
            review.setComment(reviewRequest.getComment());
        } else {
            // Create new review
            review = new Review();
            review.setUser(currentUser);
            review.setProduct(product);
            review.setRating(reviewRequest.getRating());
            review.setComment(reviewRequest.getComment());
        }
        
        Review savedReview = reviewRepository.save(review);
        return mapToReviewDto(savedReview);
    }
    
    @Override
    public Page<ReviewDto> getProductReviews(Long productId, Pageable pageable) {
        // Verify that the product exists
        getProduct(productId);
        
        return reviewRepository.findByProductId(productId, pageable)
                .map(this::mapToReviewDto);
    }
    
    @Override
    public ReviewDto getUserReviewForProduct(Long productId) {
        UserDetailsImpl userDetails = getCurrentUserDetails();
        
        return reviewRepository.findByUserIdAndProductId(userDetails.getId(), productId)
                .map(this::mapToReviewDto)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found for this product"));
    }
    
    @Override
    public boolean hasUserReviewedProduct(Long productId) {
        UserDetailsImpl userDetails = getCurrentUserDetails();
        return reviewRepository.existsByUserIdAndProductId(userDetails.getId(), productId);
    }
    
    private ReviewDto mapToReviewDto(Review review) {
        return modelMapper.map(review, ReviewDto.class);
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userService.findById(userDetails.getId());
    }
    
    private UserDetailsImpl getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserDetailsImpl) authentication.getPrincipal();
    }
    
    private Product getProduct(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
    }
}
