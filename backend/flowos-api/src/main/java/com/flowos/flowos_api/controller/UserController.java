package com.flowos.flowos_api.controller;

import com.flowos.flowos_api.dto.ChangePasswordRequest;
import com.flowos.flowos_api.dto.CreateUserRequest;
import com.flowos.flowos_api.dto.UpdateProfileRequest;
import com.flowos.flowos_api.dto.UserResponse;
import com.flowos.flowos_api.entity.User;
import com.flowos.flowos_api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "User APIs")
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }
    @Operation(summary = "Get all users")
    @GetMapping
    public List<UserResponse> getUsers() {

        return service.getAllUsers();
    }

    @Operation(summary = "Create user")
    @PostMapping
    public UserResponse createUser(
            @Valid @RequestBody CreateUserRequest request) {

        return service.save(request);
    }
    // NEW API

    @Operation(summary = "Get logged in user profile")
    @GetMapping("/profile")
    public UserResponse getProfile(Authentication authentication) {

        return service.getProfile(authentication.getName());

    }
    @Operation(summary = "Update profile")
    @PutMapping("/profile")
    public UserResponse updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request
    ) {

        return service.updateProfile(
                authentication.getName(),
                request
        );

    }

    @Operation(summary = "Change password")
    @PutMapping("/password")
    public String changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request
    ) {

        System.out.println("===== CHANGE PASSWORD API HIT =====");

        return service.changePassword(
                authentication.getName(),
                request
        );

    }

}