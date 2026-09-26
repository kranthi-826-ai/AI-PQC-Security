package com.pqc.security.auth.controller;

import com.pqc.security.auth.dto.AuthResponse;
import com.pqc.security.auth.dto.LoginRequest;
import com.pqc.security.auth.dto.RegisterRequest;
import com.pqc.security.auth.entity.UserEntity;
import com.pqc.security.auth.repository.UserRepository;
import com.pqc.security.auth.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new AuthResponse(
                            "Username already exists",
                            request.getUsername(),
                            null,
                            null));
        }

        UserEntity user = new UserEntity(
                request.getUsername(),
                passwordEncoder.encode(request.getPassword()),
                "ROLE_USER");

        userRepository.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new AuthResponse(
                        "User registered successfully",
                        user.getUsername(),
                        user.getRole(),
                        null));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return userRepository.findByUsername(request.getUsername())
                .filter(user -> passwordEncoder.matches(
                        request.getPassword(),
                        user.getPasswordHash()))
                .<ResponseEntity<?>>map(user -> {
                    String token = jwtService.generateToken(
                            user.getUsername(),
                            user.getRole());

                    return ResponseEntity.ok(new AuthResponse(
                            "Login successful",
                            user.getUsername(),
                            user.getRole(),
                            token));
                })
                .orElseGet(() -> ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse(
                                "Invalid username or password",
                                request.getUsername(),
                                null,
                                null)));
    }
}