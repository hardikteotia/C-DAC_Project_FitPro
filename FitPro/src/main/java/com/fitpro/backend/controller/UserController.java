package com.fitpro.backend.controller;

import com.fitpro.backend.dto.ChangePasswordRequest;
import com.fitpro.backend.entity.AppUser;
import com.fitpro.backend.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private AppUserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        // 1. Get currently logged-in user's email
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // 2. Find User
        AppUser user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Verify Old Password
        // Note: matches(raw, encoded) works even if you are using NoOp (Plain text) for now.
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect old password");
        }

        // 4. Update & Save New Password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepo.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }
}