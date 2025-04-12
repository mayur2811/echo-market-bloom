
package com.ecommerce.service.impl;

import com.ecommerce.dto.UserDto;
import com.ecommerce.entity.PasswordResetToken;
import com.ecommerce.entity.User;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.PasswordResetTokenRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.UserDetailsImpl;
import com.ecommerce.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    
    @Override
    public User createUser(String name, String email, String password, User.Role role) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        return userRepository.save(user);
    }
    
    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
    
    @Override
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
    
    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    @Override
    @Transactional
    public UserDto updateProfile(Long userId, UserDto userDto) {
        User user = findById(userId);
        
        user.setName(userDto.getName());
        user.setAddress(userDto.getAddress());
        user.setCity(userDto.getCity());
        user.setState(userDto.getState());
        user.setZipCode(userDto.getZipCode());
        user.setCountry(userDto.getCountry());
        user.setPhone(userDto.getPhone());
        
        User updatedUser = userRepository.save(user);
        return modelMapper.map(updatedUser, UserDto.class);
    }
    
    @Override
    public UserDto getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = findById(userDetails.getId());
        return modelMapper.map(user, UserDto.class);
    }
    
    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }
    
    @Override
    @Transactional
    public void createPasswordResetTokenForUser(User user, String token) {
        // Remove existing tokens for the user
        passwordResetTokenRepository.deleteByUser(user);
        
        // Create new token
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(24)); // Token valid for 24 hours
        
        passwordResetTokenRepository.save(resetToken);
    }
    
    @Override
    public boolean validatePasswordResetToken(String token) {
        return passwordResetTokenRepository.findByToken(token)
                .map(resetToken -> !resetToken.isExpired())
                .orElse(false);
    }
    
    @Override
    public User getUserByPasswordResetToken(String token) {
        return passwordResetTokenRepository.findByToken(token)
                .map(PasswordResetToken::getUser)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid password reset token"));
    }
}
