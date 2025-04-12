
package com.ecommerce.service;

import com.ecommerce.dto.PaymentRequest;

import java.util.Map;

public interface PaymentService {
    Map<String, Object> createPaymentOrder(PaymentRequest paymentRequest);
    Map<String, Object> verifyPayment(String orderId, String paymentId, String signature);
}
