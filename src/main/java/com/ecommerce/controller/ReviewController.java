
package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.ReviewDto;
import com.ecommerce.dto.ReviewRequest;
import com.ecommerce.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewController {
    
    private final ReviewService reviewService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<ReviewDto>> addReview(@Valid @RequestBody ReviewRequest reviewRequest) {
        ReviewDto review = reviewService.addReview(reviewRequest);
        
        return ResponseEntity.ok(
                ApiResponse.<ReviewDto>builder()
                        .success(true)
                        .message("Review added successfully")
                        .data(review)
                        .build()
        );
    }
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<Page<ReviewDto>>> getProductReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort sort = direction.equalsIgnoreCase("desc") ? 
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<ReviewDto> reviews = reviewService.getProductReviews(productId, pageable);
        
        return ResponseEntity.ok(
                ApiResponse.<Page<ReviewDto>>builder()
                        .success(true)
                        .message("Product reviews fetched successfully")
                        .data(reviews)
                        .build()
        );
    }
    
    @GetMapping("/user/product/{productId}")
    public ResponseEntity<ApiResponse<ReviewDto>> getUserReviewForProduct(@PathVariable Long productId) {
        ReviewDto review = reviewService.getUserReviewForProduct(productId);
        
        return ResponseEntity.ok(
                ApiResponse.<ReviewDto>builder()
                        .success(true)
                        .message("User review fetched successfully")
                        .data(review)
                        .build()
        );
    }
    
    @GetMapping("/check/{productId}")
    public ResponseEntity<ApiResponse<Boolean>> hasUserReviewedProduct(@PathVariable Long productId) {
        boolean hasReviewed = reviewService.hasUserReviewedProduct(productId);
        
        return ResponseEntity.ok(
                ApiResponse.<Boolean>builder()
                        .success(true)
                        .data(hasReviewed)
                        .build()
        );
    }
}
