package com.fitpro.backend.service;

import com.fitpro.backend.entity.AppUser;
import com.fitpro.backend.entity.Role;
import com.fitpro.backend.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AppUserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder; // 🔒 The Secret Sauce

    public AppUser register(String email, String password, String role) {
        // 1. Check if user exists
        if (userRepo.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already taken");
        }

        // 2. Create User
        AppUser user = new AppUser();
        user.setEmail(email);

        // 3. ENCODE THE PASSWORD (The Magic Step)
        // Turns "1234" into "$2a$10$..."
        user.setPassword(password);

        user.setRole(Role.valueOf(role));

        return userRepo.save(user);
    }
}