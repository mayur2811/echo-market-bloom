
package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.OrderDto;
import com.ecommerce.dto.OrderRequest;
import com.ecommerce.entity.Order;
import com.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        OrderDto order = orderService.createOrder(orderRequest);
        
        return ResponseEntity.ok(
                ApiResponse.<OrderDto>builder()
                        .success(true)
                        .message("Order created successfully")
                        .data(order)
                        .build()
        );
    }
    
    @GetMapping("/buyer")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getBuyerOrders() {
        List<OrderDto> orders = orderService.getBuyerOrders();
        
        return ResponseEntity.ok(
                ApiResponse.<List<OrderDto>>builder()
                        .success(true)
                        .message("Buyer orders fetched successfully")
                        .data(orders)
                        .build()
        );
    }
    
    @GetMapping("/seller")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getSellerOrders() {
        List<OrderDto> orders = orderService.getSellerOrders();
        
        return ResponseEntity.ok(
                ApiResponse.<List<OrderDto>>builder()
                        .success(true)
                        .message("Seller orders fetched successfully")
                        .data(orders)
                        .build()
        );
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderDetails(@PathVariable Long id) {
        OrderDto order = orderService.getOrderDetails(id);
        
        return ResponseEntity.ok(
                ApiResponse.<OrderDto>builder()
                        .success(true)
                        .message("Order details fetched successfully")
                        .data(order)
                        .build()
        );
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Order.OrderStatus status) {
        
        OrderDto order = orderService.updateOrderStatus(id, status);
        
        return ResponseEntity.ok(
                ApiResponse.<OrderDto>builder()
                        .success(true)
                        .message("Order status updated successfully")
                        .data(order)
                        .build()
        );
    }
}
