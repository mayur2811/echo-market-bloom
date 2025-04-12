
package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private int stock;
    private String category;
    private String imageUrl;
    private boolean featured;
    private boolean upcoming;
    private LocalDateTime createdAt;
    private Double averageRating;
    private UserDto seller;
}
