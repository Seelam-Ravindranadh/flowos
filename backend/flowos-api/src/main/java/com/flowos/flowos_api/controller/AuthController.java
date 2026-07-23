package com.flowos.flowos_api.controller;

import com.flowos.flowos_api.dto.LoginRequest;
import com.flowos.flowos_api.dto.LoginResponse;
import com.flowos.flowos_api.dto.SignupRequest;
import com.flowos.flowos_api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(
            @RequestBody SignupRequest request) {

        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        System.out.println(">>> LOGIN API HIT <<<");

        return ResponseEntity.ok(authService.login(request));
    }


}