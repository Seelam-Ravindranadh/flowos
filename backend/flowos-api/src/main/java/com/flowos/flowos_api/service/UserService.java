package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.ChangePasswordRequest;
import com.flowos.flowos_api.dto.UpdateProfileRequest;
import com.flowos.flowos_api.dto.UserResponse;
import com.flowos.flowos_api.entity.User;
import com.flowos.flowos_api.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return repository.findAll();
    }

    public User save(User user) {

        if (repository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        return repository.save(user);
    }

    public UserResponse getProfile(String email) {

        User user = repository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return new UserResponse(

                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()

        );

    }
    public UserResponse updateProfile(
            String email,
            UpdateProfileRequest request
    ) {

        User user = repository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        repository.save(user);

        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        );
    }
    public String changePassword(
            String email,
            ChangePasswordRequest request
    ) {

        User user = repository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!passwordEncoder.matches(
                request.getOldPassword(),
                user.getPassword())) {

            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        repository.save(user);

        return "Password updated successfully";
    }

}