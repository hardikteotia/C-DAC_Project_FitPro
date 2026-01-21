package com.fitpro.backend.controller;

import com.fitpro.backend.entity.Trainer;
import com.fitpro.backend.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trainers")
@CrossOrigin(origins = "*")
public class TrainerController {

    @Autowired
    private TrainerService trainerService;

    // 1. GET ALL (Trainers can see other trainers)
    @GetMapping
    public List<Trainer> getAllTrainers() {
        return trainerService.getAllTrainers();
    }

    // 2. GET BY ID (View Profile)
    @GetMapping("/{id}")
    public Trainer getTrainerById(@PathVariable Long id) {
        return trainerService.getTrainerById(id);
    }

    // 3. UPDATE SELF (PUT) - Trainer updates their own bio/skills
    @PutMapping("/{id}")
    public Trainer updateTrainer(@PathVariable Long id, @RequestBody Trainer trainer) {
        return trainerService.updateTrainer(id, trainer);
    }

    // 4. PATCH SELF (Partial Update)
    @PatchMapping("/{id}")
    public Trainer patchTrainer(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return trainerService.patchTrainer(id, updates);
    }

    // --- REMOVED: POST (Create) and DELETE (Remove) ---
    // Trainers cannot hire or fire. Only Admin can do that.
}