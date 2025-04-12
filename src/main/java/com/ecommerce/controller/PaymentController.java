
package com.ecommerce.controller;

import com.ecommerce.dto.ApiResponse;
import com.ecommerce.dto.OrderDto;
import com.ecommerce.dto.PaymentRequest;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {
    
    private final PaymentService paymentService;
    private final OrderService orderService;
    
    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkout(@Valid @RequestBody PaymentRequest paymentRequest) {
        Map<String, Object> paymentOrder = paymentService.createPaymentOrder(paymentRequest);
        
        return ResponseEntity.ok(
                ApiResponse.<Map<String, Object>>builder()
                        .success(true)
                        .message("Payment order created successfully")
                        .data(paymentOrder)
                        .build()
        );
    }
    
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<OrderDto>> verifyPayment(
            @RequestParam String orderId,
            @RequestParam String paymentId,
            @RequestParam String signature) {
        
        Map<String, Object> result = paymentService.verifyPayment(orderId, paymentId, signature);
        
        // If verification is successful, update order status
        if ((boolean) result.get("signatureValid")) {
            OrderDto order = orderService.completePayment(Long.valueOf(result.get("orderId").toString()), paymentId);
            
            return ResponseEntity.ok(
                    ApiResponse.<OrderDto>builder()
                            .success(true)
                            .message("Payment verified and order updated successfully")
                            .data(order)
                            .build()
            );
        } else {
            return ResponseEntity.badRequest().body(
                    ApiResponse.<OrderDto>builder()
                            .success(false)
                            .message("Payment verification failed")
                            .build()
            );
        }
    }
}
