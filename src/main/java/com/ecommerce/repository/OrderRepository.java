
package com.ecommerce.repository;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    Optional<Order> findByOrderNumber(String orderNumber);
    
    @Query("SELECT o FROM Order o WHERE o.id IN " +
           "(SELECT oi.order.id FROM OrderItem oi WHERE oi.product.user.id = :sellerId)")
    List<Order> findOrdersForSeller(@Param("sellerId") Long sellerId);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status != 'CANCELLED' " +
           "AND o.user.id = :userId")
    BigDecimal getTotalSpendingForUser(@Param("userId") Long userId);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate")
    long countOrdersSince(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.createdAt >= :startDate " +
           "AND o.status != 'CANCELLED'")
    BigDecimal getTotalRevenueSince(@Param("startDate") LocalDateTime startDate);
}
