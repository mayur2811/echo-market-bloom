
package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private String orderNumber;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PROCESSING;
    
    private BigDecimal totalAmount;
    
    // Shipping information
    private String fullName;
    private String email;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String country;
    private String phone;
    
    // Payment information
    private String paymentId;
    private String paymentMethod = "RAZORPAY";
    private boolean paymentCompleted = false;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<OrderItem> orderItems = new HashSet<>();
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    public enum OrderStatus {
        PROCESSING, SHIPPED, DELIVERED, CANCELLED
    }
}
