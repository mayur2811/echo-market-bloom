
package com.ecommerce.dto;

import com.ecommerce.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private String orderNumber;
    private Order.OrderStatus status;
    private BigDecimal totalAmount;
    private String fullName;
    private String email;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private String phone;
    private String paymentId;
    private String paymentMethod;
    private boolean paymentCompleted;
    private LocalDateTime createdAt;
    private List<OrderItemDto> orderItems;
}
