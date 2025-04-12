
package com.ecommerce.service.impl;

import com.ecommerce.dto.PaymentRequest;
import com.ecommerce.entity.Order;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {
    
    private final OrderRepository orderRepository;
    private final OrderService orderService;
    
    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;
    
    @Override
    public Map<String, Object> createPaymentOrder(PaymentRequest paymentRequest) {
        try {
            Order order = orderRepository.findById(paymentRequest.getOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + paymentRequest.getOrderId()));
            
            // Create a dummy Razorpay order (in a real app, you would call Razorpay API)
            String orderId = "order_" + UUID.randomUUID().toString().substring(0, 10);
            
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", orderId);
            response.put("amount", paymentRequest.getAmount().multiply(new java.math.BigDecimal(100)).intValue());
            response.put("currency", "INR");
            response.put("keyId", razorpayKeyId);
            
            log.info("Created payment order: {}", orderId);
            return response;
            
        } catch (Exception e) {
            log.error("Error creating payment order", e);
            throw new RuntimeException("Error processing payment request", e);
        }
    }
    
    @Override
    public Map<String, Object> verifyPayment(String orderId, String paymentId, String signature) {
        // In a real app, you would verify the signature with Razorpay
        // For this demo, we'll simulate a successful verification
        
        // Extract the actual order ID from the Razorpay order ID
        String actualOrderId = orderId.replace("order_", "");
        
        Map<String, Object> response = new HashMap<>();
        response.put("signatureValid", true);
        response.put("orderId", actualOrderId);
        response.put("paymentId", paymentId);
        
        log.info("Payment verified: {}", paymentId);
        return response;
    }
}
