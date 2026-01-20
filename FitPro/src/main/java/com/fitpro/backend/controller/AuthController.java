package com.fitpro.backend.controller;

import com.fitpro.backend.entity.AppUser;
import com.fitpro.backend.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AppUserRepository userRepo;

    @PostMapping("/login")
    public String login(@RequestBody AppUser loginRequest) {
        Optional<AppUser> user = userRepo.findByEmail(loginRequest.getEmail());

        if (user.isPresent() && user.get().getPassword().equals(loginRequest.getPassword())) {
            return "LOGIN SUCCESS! Role: " + user.get().getRole();
        } else {
            throw new RuntimeException("Invalid Credentials");
        }
    }
}