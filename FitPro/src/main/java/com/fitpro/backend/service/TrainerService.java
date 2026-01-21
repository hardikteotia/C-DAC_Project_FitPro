package com.fitpro.backend.service;

import com.fitpro.backend.entity.Member;
import com.fitpro.backend.entity.Trainer;
import com.fitpro.backend.repository.MemberRepository;
import com.fitpro.backend.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class TrainerService {

    @Autowired
    private TrainerRepository trainerRepo;

    @Autowired
    private MemberRepository memberRepo; // Needed for the "Safety Delete"

    // 1. GET ALL
    public List<Trainer> getAllTrainers() {
        return trainerRepo.findAll();
    }

    // 2. GET ONE
    public Trainer getTrainerById(Long id) {
        return trainerRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trainer not found with ID: " + id));
    }

    // 3. CREATE (Admin adds a trainer) - *Simplified for now, just saves the profile*
    public Trainer createTrainer(Trainer trainer) {
        // In a real app, you would create the AppUser login here too.
        // For now, we assume we are just adding the profile details.
        return trainerRepo.save(trainer);
    }

    // 4. UPDATE (PUT - Full Update)
    public Trainer updateTrainer(Long id, Trainer updatedData) {
        Trainer trainer = getTrainerById(id);

        // Update fields (Matches your DB columns)
        trainer.setTrainerName(updatedData.getTrainerName());
        trainer.setPhone(updatedData.getPhone());
        trainer.setSpecialization(updatedData.getSpecialization());

        return trainerRepo.save(trainer);
    }

    // 5. PATCH (Partial Update - e.g., just changing phone)
    public Trainer patchTrainer(Long id, Map<String, Object> updates) {
        Trainer trainer = getTrainerById(id);

        updates.forEach((key, value) -> {
            switch (key) {
                case "trainerName": trainer.setTrainerName((String) value); break;
                case "phone": trainer.setPhone((String) value); break;
                case "specialization": trainer.setSpecialization((String) value); break;
            }
        });
        return trainerRepo.save(trainer);
    }

    // 6. DELETE (The Safety Delete)
    public void deleteTrainer(Long id) {
        Trainer trainer = getTrainerById(id);

        // CRITICAL: Before deleting the trainer, free the members!
        List<Member> assignedMembers = trainer.getMembers();
        if (assignedMembers != null) {
            for (Member m : assignedMembers) {
                m.setTrainer(null); // Unassign the trainer
                memberRepo.save(m); // Save the member
            }
        }

        trainerRepo.delete(trainer);
    }
}