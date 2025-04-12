
package com.ecommerce.service;

import com.ecommerce.dto.OrderDto;
import com.ecommerce.dto.OrderRequest;
import com.ecommerce.entity.Order;

import java.util.List;

public interface OrderService {
    OrderDto createOrder(OrderRequest orderRequest);
    List<OrderDto> getBuyerOrders();
    List<OrderDto> getSellerOrders();
    OrderDto getOrderDetails(Long orderId);
    OrderDto updateOrderStatus(Long orderId, Order.OrderStatus status);
    OrderDto completePayment(Long orderId, String paymentId);
}
