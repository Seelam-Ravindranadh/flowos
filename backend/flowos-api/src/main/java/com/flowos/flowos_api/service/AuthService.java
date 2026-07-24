package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.LoginRequest;
import com.flowos.flowos_api.dto.LoginResponse;
import com.flowos.flowos_api.dto.RegisterRequest;
import com.flowos.flowos_api.entity.User;
import com.flowos.flowos_api.repository.UserRepository;
import com.flowos.flowos_api.security.JwtService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Register New User
     */
    public String register(RegisterRequest request) {

        log.info("Register request received for email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {

            log.warn("Registration failed. Email already exists: {}", request.getEmail());

            return "Email already registered";
        }

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        userRepository.save(user);

        log.info("User registered successfully: {}", request.getEmail());

        return "User Registered Successfully";
    }

    /**
     * Login
     */
    /*public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid Email"));

        validatePassword(
                request.getPassword(),
                user.getPassword()
        );

        String token = jwtService.generateToken(user);

        return new LoginResponse(
                token,
                "Bearer",
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        );
    } */

    public LoginResponse login(LoginRequest request) {

        log.info("Login request received: {}", request.getEmail());

        var optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {

            log.warn("Login failed. User not found: {}", request.getEmail());

            throw new RuntimeException("Invalid Email");
        }

        User user = optionalUser.get();

        validatePassword(
                request.getPassword(),
                user.getPassword(),
                request.getEmail()
        );

        String token = jwtService.generateToken(user);

        log.info("User logged in successfully: {}", request.getEmail());

        return new LoginResponse(
                token,
                "Bearer",
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole()
        );
    }
    /**
     * Validate Password
     */


    private void validatePassword(
            String rawPassword,
            String encodedPassword,
            String email
    ) {

        System.out.println("=================================");
        System.out.println("Email            : " + email);
        System.out.println("Raw Password     : " + rawPassword);
        System.out.println("Encoded Password : " + encodedPassword);

        boolean matched = passwordEncoder.matches(rawPassword, encodedPassword);

        System.out.println("Matched          : " + matched);
        System.out.println("=================================");

        if (!matched) {
            log.warn("Invalid password for user: {}", email);
            throw new RuntimeException("Invalid Password");
        }
    }


}