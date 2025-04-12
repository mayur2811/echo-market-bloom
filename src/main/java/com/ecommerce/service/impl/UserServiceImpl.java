
package com.ecommerce.service.impl;

import com.ecommerce.dto.UserDto;
import com.ecommerce.entity.User;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.security.UserDetailsImpl;
import com.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
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
        User currentUser = getCurrentUser();
        
        // Check if the user is updating their own profile
        if (!currentUser.getId().equals(userId)) {
            throw new UnauthorizedException("You can only update your own profile");
        }
        
        // Update user profile
        currentUser.setName(userDto.getName());
        
        // Update address information if provided
        if (userDto.getAddress() != null) currentUser.setAddress(userDto.getAddress());
        if (userDto.getCity() != null) currentUser.setCity(userDto.getCity());
        if (userDto.getState() != null) currentUser.setState(userDto.getState());
        if (userDto.getZipCode() != null) currentUser.setZipCode(userDto.getZipCode());
        if (userDto.getCountry() != null) currentUser.setCountry(userDto.getCountry());
        if (userDto.getPhone() != null) currentUser.setPhone(userDto.getPhone());
        
        User savedUser = userRepository.save(currentUser);
        return modelMapper.map(savedUser, UserDto.class);
    }

    @Override
    public UserDto getCurrentUserProfile() {
        User currentUser = getCurrentUser();
        return modelMapper.map(currentUser, UserDto.class);
    }
    
    @Override
    @Transactional
    public User saveUser(User user) {
        return userRepository.save(user);
    }
    
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return findById(userDetails.getId());
    }
}
