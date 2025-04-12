
package com.ecommerce.service;

import com.ecommerce.dto.ReviewDto;
import com.ecommerce.dto.ReviewRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReviewService {
    ReviewDto addReview(ReviewRequest reviewRequest);
    Page<ReviewDto> getProductReviews(Long productId, Pageable pageable);
    ReviewDto getUserReviewForProduct(Long productId);
    boolean hasUserReviewedProduct(Long productId);
}
