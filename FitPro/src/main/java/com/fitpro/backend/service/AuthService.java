package com.fitpro.backend.service;

import com.fitpro.backend.entity.AppUser;
import com.fitpro.backend.entity.Role;
import com.fitpro.backend.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime; // 👈 Import for Expiry Time
import java.util.UUID;          // 👈 Import for Random Token

@Service
public class AuthService {

    @Autowired
    private AppUserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Existing Register Method
    public AppUser register(String email, String password, String role) {
        if (userRepo.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already taken");
        }

        AppUser user = new AppUser();
        user.setEmail(email);
        user.setPassword(password); // Keeps plain text if using NoOp, or hashes if using BCrypt
        user.setRole(Role.valueOf(role));

        return userRepo.save(user);
    }

    //1. GENERATE RESET TOKEN (For Forgot Password)
    public void generateResetToken(String email) {
        AppUser user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate random token
        String token = UUID.randomUUID().toString();

        // Save to DB (Expires in 15 minutes)
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepo.save(user);

        // SIMULATE EMAIL SENDING (Check your VS Code Console!)
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        System.out.println("📧 [EMAIL SIMULATION] Reset Link for " + email + ": " + resetLink);
    }

    // 2. PERFORM PASSWORD RESET
    public void resetPassword(String token, String newPassword) {
        // You need to ensure 'findByResetToken' exists in AppUserRepository
        AppUser user = userRepo.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid Token"));

        // Check Expiry
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }

        // Update Password (Encodes it correctly based on your SecurityConfig)
        user.setPassword(passwordEncoder.encode(newPassword));

        // Clear Token so it can't be used again
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepo.save(user);
    }
}