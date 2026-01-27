package com.fitpro.backend.service;

import com.fitpro.backend.entity.AppUser;
import com.fitpro.backend.entity.Member;
import com.fitpro.backend.entity.Role;
import com.fitpro.backend.entity.Trainer;
import com.fitpro.backend.repository.AppUserRepository;
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
    private MemberRepository memberRepo;

    @Autowired
    private AppUserRepository userRepo;

    // 1. GET ALL (Active Only)
    public List<Trainer> getAllTrainers() {
        return trainerRepo.findByActiveTrue();
    }

    public Trainer getTrainerById(Long id) {
        return trainerRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trainer not found"));
    }

    public Trainer createTrainer(Map<String, Object> data) {
        String name = (String) data.get("trainerName");
        String email = (String) data.get("email");
        String password = (String) data.get("password");
        String phone = (String) data.get("phone");
        String specialization = (String) data.get("specialization");

        AppUser user = new AppUser();
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(Role.TRAINER);
        AppUser savedUser = userRepo.save(user);

        Trainer newTrainer = new Trainer();
        newTrainer.setTrainerName(name);
        newTrainer.setPhone(phone);
        newTrainer.setSpecialization(specialization);
        newTrainer.setUser(savedUser);

        return trainerRepo.save(newTrainer);
    }

    // 4. UPDATE (PUT - Full Update by Admin)
    public Trainer updateTrainer(Long id, Trainer updatedData) {
        Trainer trainer = getTrainerById(id);

        trainer.setTrainerName(updatedData.getTrainerName());
        trainer.setPhone(updatedData.getPhone());
        trainer.setSpecialization(updatedData.getSpecialization());

        if (updatedData.getUser() != null && updatedData.getUser().getEmail() != null) {
            trainer.getUser().setEmail(updatedData.getUser().getEmail());
            userRepo.save(trainer.getUser());
        }

        return trainerRepo.save(trainer);
    }

    // PATCH (Partial Update)
    public Trainer patchTrainer(Long id, Map<String, Object> updates) {
        Trainer trainer = getTrainerById(id);

        updates.forEach((key, value) -> {
            switch (key) {
                case "trainerName":
                    trainer.setTrainerName((String) value);
                    break;
                case "phone":
                    trainer.setPhone((String) value);
                    break;
                case "specialization":
                    trainer.setSpecialization((String) value);
                    break;
                case "email":
                    if (trainer.getUser() != null) {
                        trainer.getUser().setEmail((String) value);
                        userRepo.save(trainer.getUser());
                    }
                    break;
            }
        });
        return trainerRepo.save(trainer);
    }

    // 3. SOFT DELETE
    public void deleteTrainer(Long id) {
        Trainer trainer = getTrainerById(id);

        List<Member> assignedMembers = trainer.getMembers();
        if (assignedMembers != null) {
            for (Member m : assignedMembers) {
                m.setTrainer(null);
                memberRepo.save(m);
            }
        }
        trainer.setActive(false);
        trainerRepo.save(trainer);
    }

    // 👇 NEW METHOD: Get Clients for the Logged-in Trainer
    public List<Member> getMyClients(String email) {
        // 1. Find User by Email (from Login Token)
        AppUser user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // 2. Find Trainer Profile linked to this User
        Trainer trainer = trainerRepo.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trainer profile not found"));

        // 3. Return their Students
        return trainer.getMembers();
    }
}