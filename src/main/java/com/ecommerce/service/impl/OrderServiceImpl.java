
package com.ecommerce.service.impl;

import com.ecommerce.dto.OrderDto;
import com.ecommerce.dto.OrderItemDto;
import com.ecommerce.dto.OrderRequest;
import com.ecommerce.entity.*;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.OrderItemRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.security.UserDetailsImpl;
import com.ecommerce.service.EmailService;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final UserService userService;
    private final EmailService emailService;
    private final ModelMapper modelMapper;
    
    @Override
    @Transactional
    public OrderDto createOrder(OrderRequest orderRequest) {
        User currentUser = getCurrentUser();
        List<CartItem> cartItems = cartItemRepository.findByUser(currentUser);
        
        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cannot create order with empty cart");
        }
        
        // Create new order
        Order order = new Order();
        order.setUser(currentUser);
        order.setOrderNumber(generateOrderNumber());
        order.setStatus(Order.OrderStatus.PROCESSING);
        
        // Set shipping information
        order.setFullName(orderRequest.getFullName());
        order.setEmail(orderRequest.getEmail());
        order.setAddress(orderRequest.getAddress());
        order.setCity(orderRequest.getCity());
        order.setState(orderRequest.getState());
        order.setZipCode(orderRequest.getZipCode());
        order.setCountry(orderRequest.getCountry());
        order.setPhone(orderRequest.getPhone());
        
        // Calculate total amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem cartItem : cartItems) {
            BigDecimal price = cartItem.getProduct().getDiscountPrice() != null ? 
                    cartItem.getProduct().getDiscountPrice() : cartItem.getProduct().getPrice();
            totalAmount = totalAmount.add(price.multiply(new BigDecimal(cartItem.getQuantity())));
        }
        order.setTotalAmount(totalAmount);
        
        // Save order
        Order savedOrder = orderRepository.save(order);
        
        // Create order items
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getDiscountPrice() != null ? 
                    cartItem.getProduct().getDiscountPrice() : cartItem.getProduct().getPrice());
            orderItem.setSelectedSize(cartItem.getSelectedSize());
            orderItem.setProductName(cartItem.getProduct().getName());
            orderItem.setProductImage(cartItem.getProduct().getImageUrl());
            
            orderItemRepository.save(orderItem);
        }
        
        // Clear cart
        cartItemRepository.deleteByUser(currentUser);
        
        // Send email notification
        sendOrderConfirmationEmail(savedOrder);
        
        return mapToOrderDto(savedOrder);
    }
    
    @Override
    public List<OrderDto> getBuyerOrders() {
        User currentUser = getCurrentUser();
        List<Order> orders = orderRepository.findByUser(currentUser);
        
        return orders.stream()
                .map(this::mapToOrderDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<OrderDto> getSellerOrders() {
        UserDetailsImpl userDetails = getCurrentUserDetails();
        List<Order> orders = orderRepository.findOrdersForSeller(userDetails.getId());
        
        return orders.stream()
                .map(this::mapToOrderDto)
                .collect(Collectors.toList());
    }
    
    @Override
    public OrderDto getOrderDetails(Long orderId) {
        UserDetailsImpl userDetails = getCurrentUserDetails();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        // Check if the current user is either the buyer or seller of this order
        if (!order.getUser().getId().equals(userDetails.getId())) {
            // If not buyer, check if seller of any product in the order
            List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
            boolean isSeller = orderItems.stream()
                    .anyMatch(item -> item.getProduct().getUser().getId().equals(userDetails.getId()));
            
            if (!isSeller) {
                throw new UnauthorizedException("You don't have permission to view this order");
            }
        }
        
        return mapToOrderDto(order);
    }
    
    @Override
    @Transactional
    public OrderDto updateOrderStatus(Long orderId, Order.OrderStatus status) {
        UserDetailsImpl userDetails = getCurrentUserDetails();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        // Only sellers can update order status
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
        boolean isSeller = orderItems.stream()
                .anyMatch(item -> item.getProduct().getUser().getId().equals(userDetails.getId()));
        
        if (!isSeller) {
            throw new UnauthorizedException("Only sellers can update order status");
        }
        
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);
        
        // Send status update email
        sendOrderStatusUpdateEmail(updatedOrder);
        
        return mapToOrderDto(updatedOrder);
    }
    
    @Override
    @Transactional
    public OrderDto completePayment(Long orderId, String paymentId) {
        User currentUser = getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
        
        // Check if the current user is the buyer of this order
        if (!order.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You don't have permission to complete payment for this order");
        }
        
        // Update payment information
        order.setPaymentId(paymentId);
        order.setPaymentCompleted(true);
        
        Order updatedOrder = orderRepository.save(order);
        
        // Send payment confirmation email
        sendPaymentConfirmationEmail(updatedOrder);
        
        return mapToOrderDto(updatedOrder);
    }
    
    private OrderDto mapToOrderDto(Order order) {
        OrderDto orderDto = modelMapper.map(order, OrderDto.class);
        
        // Get order items
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getId());
        List<OrderItemDto> orderItemDtos = orderItems.stream()
                .map(item -> modelMapper.map(item, OrderItemDto.class))
                .collect(Collectors.toList());
        
        orderDto.setOrderItems(orderItemDtos);
        return orderDto;
    }
    
    private String generateOrderNumber() {
        return UUID.randomUUID().toString().replaceAll("-", "").substring(0, 10).toUpperCase();
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
    
    private void sendOrderConfirmationEmail(Order order) {
        String subject = "Order Confirmation: " + order.getOrderNumber();
        String content = "Dear " + order.getFullName() + ",\n\n" +
                "Thank you for your order! Your order #" + order.getOrderNumber() + " has been placed successfully.\n\n" +
                "Order Total: $" + order.getTotalAmount() + "\n\n" +
                "We will process your order soon. You will receive another email once your order ships.\n\n" +
                "Thank you for shopping with us!\n\n" +
                "Best regards,\nThe Ecommerce Team";
        
        emailService.sendEmail(order.getEmail(), subject, content);
    }
    
    private void sendOrderStatusUpdateEmail(Order order) {
        String subject = "Order Status Update: " + order.getOrderNumber();
        String content = "Dear " + order.getFullName() + ",\n\n" +
                "Your order #" + order.getOrderNumber() + " has been updated to: " + order.getStatus() + "\n\n" +
                "Thank you for shopping with us!\n\n" +
                "Best regards,\nThe Ecommerce Team";
        
        emailService.sendEmail(order.getEmail(), subject, content);
    }
    
    private void sendPaymentConfirmationEmail(Order order) {
        String subject = "Payment Confirmation: " + order.getOrderNumber();
        String content = "Dear " + order.getFullName() + ",\n\n" +
                "Your payment for order #" + order.getOrderNumber() + " has been received successfully.\n\n" +
                "Payment ID: " + order.getPaymentId() + "\n" +
                "Amount: $" + order.getTotalAmount() + "\n\n" +
                "Thank you for shopping with us!\n\n" +
                "Best regards,\nThe Ecommerce Team";
        
        emailService.sendEmail(order.getEmail(), subject, content);
    }
}
