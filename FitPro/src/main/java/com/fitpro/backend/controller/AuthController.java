package com.fitpro.backend.controller;

import com.fitpro.backend.security.JwtUtil;
import com.fitpro.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private     AuthService authService;

    // ❌ MAKE SURE NO EmailService OR MicroserviceLogger IS HERE ❌

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new Exception("Incorrect username or password", e);
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails);

        // Get Role safely
        String role = "MEMBER";
        if (!userDetails.getAuthorities().isEmpty()) {
            role = userDetails.getAuthorities().stream().findFirst().get().getAuthority();
        }

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("role", role);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthenticationRequest request) {
        // Default role is MEMBER if not specified
        authService.register(request.getEmail(), request.getPassword(), "MEMBER");
        return ResponseEntity.ok("User registered successfully");
    }
}

// Helper Class
class AuthenticationRequest {
    private String email;
    private String password;

    // Constructors
    public AuthenticationRequest() {}
    public AuthenticationRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }
    // Getters & Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}