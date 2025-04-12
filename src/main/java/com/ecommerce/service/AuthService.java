
package com.ecommerce.service;

import com.ecommerce.dto.AuthRequest;
import com.ecommerce.dto.AuthResponse;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.dto.ResetPasswordRequest;

public interface AuthService {
    
    AuthResponse login(AuthRequest loginRequest);
    
    AuthResponse register(RegisterRequest registerRequest);
    
    AuthResponse refreshToken(String refreshToken);
    
    void forgotPassword(String email);
    
    void resetPassword(ResetPasswordRequest resetRequest);
    
    boolean validatePasswordResetToken(String token);
}
