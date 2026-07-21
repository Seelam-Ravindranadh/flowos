package com.flowos.flowos_api.service;

import com.flowos.flowos_api.dto.LoginRequest;
import com.flowos.flowos_api.dto.LoginResponse;
import com.flowos.flowos_api.dto.SignupRequest;
import com.flowos.flowos_api.entity.User;
import com.flowos.flowos_api.repository.UserRepository;
import com.flowos.flowos_api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    /**
     * Register New User
     */
    public String signup(SignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already registered";
        }

        User user = new User();

        user.setFirstName(request.getFirstName());

        user.setLastName(request.getLastName());

        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(request.getRole());

        userRepository.save(user);

        return "User Registered Successfully";
    }

    /**
     * Login
     */
    public LoginResponse login(LoginRequest request) {

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
    }

    /**
     * Validate Password
     */
    private void validatePassword(
            String rawPassword,
            String encodedPassword
    ) {

        if (!passwordEncoder.matches(rawPassword, encodedPassword)) {

            throw new RuntimeException("Invalid Password");

        }

    }

}