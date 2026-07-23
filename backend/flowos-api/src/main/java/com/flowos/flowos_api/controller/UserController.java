package com.flowos.flowos_api.controller;

import com.flowos.flowos_api.dto.ChangePasswordRequest;
import com.flowos.flowos_api.dto.UpdateProfileRequest;
import com.flowos.flowos_api.dto.UserResponse;
import com.flowos.flowos_api.entity.User;
import com.flowos.flowos_api.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping
    public List<User> getUsers() {
        return service.getAllUsers();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return service.save(user);
    }
    // NEW API
    @GetMapping("/profile")
    public UserResponse getProfile(Authentication authentication) {

        return service.getProfile(authentication.getName());

    }

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