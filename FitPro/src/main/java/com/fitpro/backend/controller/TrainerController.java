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

    // 3. CREATE (POST)
    @PostMapping
    public Trainer createTrainer(@RequestBody Trainer trainer) {
        return trainerService.createTrainer(trainer);
    }

    // 4. UPDATE (PUT)
    @PutMapping("/{id}")
    public Trainer updateTrainer(@PathVariable Long id, @RequestBody Trainer trainer) {
        return trainerService.updateTrainer(id, trainer);
    }

    // 5. PATCH (Partial Update)
    @PatchMapping("/{id}")
    public Trainer patchTrainer(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return trainerService.patchTrainer(id, updates);
    }

    // 6. DELETE
    @DeleteMapping("/{id}")
    public String deleteTrainer(@PathVariable Long id) {
        trainerService.deleteTrainer(id);
        return "Trainer deleted successfully (and members were unassigned).";
    }
}