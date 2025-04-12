
package com.ecommerce.service.impl;

import com.ecommerce.dto.AuthRequest;
import com.ecommerce.dto.AuthResponse;
import com.ecommerce.dto.RegisterRequest;
import com.ecommerce.entity.User;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.security.JwtTokenProvider;
import com.ecommerce.security.UserDetailsImpl;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;
    
    @Override
    public AuthResponse login(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userService.findById(userDetails.getId());
        String refreshToken = tokenProvider.generateRefreshToken(user);
        
        return AuthResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken)
                .userId(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getUsername())
                .role(userDetails.getRole())
                .build();
    }
    
    @Override
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        // Check if email already exists
        if (userService.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email already in use");
        }
        
        // Create new user
        User user = userService.createUser(
                registerRequest.getName(),
                registerRequest.getEmail(),
                registerRequest.getPassword(),
                registerRequest.getRole()
        );
        
        // Generate token
        String jwt = tokenProvider.generateTokenFromUsername(user.getEmail(), user.getId(), user.getRole().name());
        String refreshToken = tokenProvider.generateRefreshToken(user);
        
        return AuthResponse.builder()
                .token(jwt)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
    
    @Override
    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid refresh token");
        }
        
        String username = tokenProvider.getUsernameFromToken(refreshToken);
        User user = userService.findByEmail(username);
        
        String accessToken = tokenProvider.generateTokenFromUsername(user.getEmail(), user.getId(), user.getRole().name());
        
        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken) // Return the same refresh token
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
