
package com.ecommerce.repository;

import com.ecommerce.entity.OrderItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);
    
    @Query("SELECT oi FROM OrderItem oi WHERE oi.product.user.id = :sellerId")
    List<OrderItem> findOrderItemsForSeller(@Param("sellerId") Long sellerId);
    
    @Query("SELECT oi.product.id, COUNT(oi) FROM OrderItem oi GROUP BY oi.product.id ORDER BY COUNT(oi) DESC")
    List<Object[]> findMostOrderedProducts(Pageable pageable);
}
