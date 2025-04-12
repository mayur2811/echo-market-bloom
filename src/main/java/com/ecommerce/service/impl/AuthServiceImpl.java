
package com.ecommerce.service.impl;

import com.ecommerce.dto.AuthRequest;
import com.ecommerce.dto.AuthResponse;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.dto.ResetPasswordRequest;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.security.JwtTokenProvider;
import com.ecommerce.security.UserDetailsImpl;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.EmailService;
import com.ecommerce.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final EmailService emailService;
    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public AuthResponse login(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        String accessToken = tokenProvider.generateToken(authentication);
        User user = userService.findById(userDetails.getId());
        String refreshToken = tokenProvider.generateRefreshToken(user);
        
        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .userType(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .userId(user.getId())
                .build();
    }
    
    @Override
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        if (userService.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email is already taken");
        }
        
        User.Role role = "seller".equalsIgnoreCase(registerRequest.getUserType()) 
                ? User.Role.SELLER : User.Role.BUYER;
        
        User user = userService.createUser(
                registerRequest.getName(),
                registerRequest.getEmail(),
                registerRequest.getPassword(),
                role
        );
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getEmail(),
                        registerRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String accessToken = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(user);
        
        // Send welcome email
        try {
            Map<String, Object> templateModel = new HashMap<>();
            templateModel.put("name", user.getName());
            emailService.sendTemplatedEmail(
                user.getEmail(), 
                "Welcome to Our eCommerce Platform", 
                "welcome-email", 
                templateModel
            );
        } catch (Exception e) {
            // Log error but continue with registration
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
        
        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .userType(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .userId(user.getId())
                .build();
    }
    
    @Override
    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid refresh token");
        }
        
        String username = tokenProvider.getUsernameFromToken(refreshToken);
        Long userId = tokenProvider.getUserIdFromToken(refreshToken);
        User user = userService.findById(userId);
        
        String accessToken = tokenProvider.generateTokenFromUsername(
            username, userId, user.getRole().name()
        );
        
        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .userType(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .userId(user.getId())
                .build();
    }
    
    @Override
    @Transactional
    public void forgotPassword(String email) {
        try {
            User user = userService.findByEmail(email);
            String token = UUID.randomUUID().toString();
            userService.createPasswordResetTokenForUser(user, token);
            
            // Send reset email with token
            Map<String, Object> templateModel = new HashMap<>();
            templateModel.put("name", user.getName());
            templateModel.put("resetLink", "http://localhost:5173/reset-password?token=" + token);
            templateModel.put("token", token);
            
            emailService.sendTemplatedEmail(
                user.getEmail(),
                "Password Reset Request",
                "reset-password-email",
                templateModel
            );
        } catch (Exception e) {
            // Don't expose if email exists or not
            System.err.println("Failed to process forgot password: " + e.getMessage());
        }
    }
    
    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest resetRequest) {
        if (!userService.validatePasswordResetToken(resetRequest.getToken())) {
            throw new BadRequestException("Invalid or expired token");
        }
        
        User user = userService.getUserByPasswordResetToken(resetRequest.getToken());
        user.setPassword(passwordEncoder.encode(resetRequest.getPassword()));
        userService.saveUser(user);
        
        // Send confirmation email
        try {
            Map<String, Object> templateModel = new HashMap<>();
            templateModel.put("name", user.getName());
            
            emailService.sendTemplatedEmail(
                user.getEmail(),
                "Your Password Has Been Reset",
                "password-reset-confirmation",
                templateModel
            );
        } catch (Exception e) {
            // Log error but continue with password reset
            System.err.println("Failed to send password reset confirmation email: " + e.getMessage());
        }
    }
    
    @Override
    public boolean validatePasswordResetToken(String token) {
        return userService.validatePasswordResetToken(token);
    }
}
