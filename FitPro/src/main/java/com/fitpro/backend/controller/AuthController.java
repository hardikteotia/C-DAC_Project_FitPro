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
    private AuthService authService;

    // Existing Login
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

        String role = "MEMBER";
        if (!userDetails.getAuthorities().isEmpty()) {
            role = userDetails.getAuthorities().stream().findFirst().get().getAuthority();
        }

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("role", role);

        return ResponseEntity.ok(response);
    }

    // Existing Register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthenticationRequest request) {
        authService.register(request.getEmail(), request.getPassword(), "MEMBER");
        return ResponseEntity.ok("User registered successfully");
    }

    //Forgot Password Endpoint
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        try {
            authService.generateResetToken(body.get("email"));
            return ResponseEntity.ok("Reset link sent to console.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    //Reset Password Endpoint
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        try {
            String token = body.get("token");
            String newPassword = body.get("newPassword");
            authService.resetPassword(token, newPassword);
            return ResponseEntity.ok("Password reset successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

// Helper Class
class AuthenticationRequest {
    private String email;
    private String password;

    public AuthenticationRequest() {}
    public AuthenticationRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}