
package com.ecommerce.service;

import com.ecommerce.dto.UserDto;
import com.ecommerce.entity.User;

public interface UserService {
    User createUser(String name, String email, String password, User.Role role);
    User findByEmail(String email);
    User findById(Long id);
    boolean existsByEmail(String email);
    UserDto updateProfile(Long userId, UserDto userDto);
    UserDto getCurrentUserProfile();
    User saveUser(User user);
    void createPasswordResetTokenForUser(User user, String token);
    boolean validatePasswordResetToken(String token);
    User getUserByPasswordResetToken(String token);
}
