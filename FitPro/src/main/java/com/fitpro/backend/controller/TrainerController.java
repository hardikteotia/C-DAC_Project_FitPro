package com.fitpro.backend.controller;

import com.fitpro.backend.entity.Member; // 👈 Import Member
import com.fitpro.backend.entity.Trainer;
import com.fitpro.backend.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity; // 👈 Import ResponseEntity
import org.springframework.web.bind.annotation.*;

import java.security.Principal; // 👈 Import Principal (To get logged-in user)
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trainers")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TrainerController {

    @Autowired
    private TrainerService trainerService;

    // 👇 NEW ENDPOINT: Get Clients for the Logged-in Trainer
    @GetMapping("/dashboard/clients")
    public ResponseEntity<List<Member>> getMyClients(Principal principal) {
        // Principal holds the email of the person who is currently logged in
        List<Member> clients = trainerService.getMyClients(principal.getName());
        return ResponseEntity.ok(clients);
    }

    // 1. GET ALL
    @GetMapping
    public List<Trainer> getAllTrainers() {
        return trainerService.getAllTrainers();
    }

    // 2. GET BY ID
    @GetMapping("/{id}")
    public Trainer getTrainerById(@PathVariable Long id) {
        return trainerService.getTrainerById(id);
    }

    // 3. UPDATE SELF
    @PutMapping("/{id}")
    public Trainer updateTrainer(@PathVariable Long id, @RequestBody Trainer trainer) {
        return trainerService.updateTrainer(id, trainer);
    }

    // 4. PATCH SELF
    @PatchMapping("/{id}")
    public Trainer patchTrainer(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return trainerService.patchTrainer(id, updates);
    }

    // 5. POST (Create New Trainer)
    @PostMapping
    public Trainer createTrainer(@RequestBody Map<String, Object> trainerData) {
        return trainerService.createTrainer(trainerData);
    }
}