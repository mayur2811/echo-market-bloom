
package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDto {
    private Long id;
    private Long productId;
    private String name;
    private String image;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer quantity;
    private String selectedSize;
}
