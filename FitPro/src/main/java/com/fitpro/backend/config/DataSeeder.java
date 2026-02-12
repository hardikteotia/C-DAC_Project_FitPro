package com.fitpro.backend.config;

import com.fitpro.backend.entity.*;
import com.fitpro.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder; // ✅ Added this import
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AppUserRepository userRepo;

    @Autowired
    private MembershipPlanRepository planRepo;

    @Autowired
    private TrainerRepository trainerRepo;

    @Autowired
    private PasswordEncoder passwordEncoder; // ✅ Added this to handle encryption

    @Override
    public void run(String... args) throws Exception {

        // -----------------------------------------------------------
        // 1. SEED ADMIN (The Boss)
        // -----------------------------------------------------------
        if (!userRepo.existsByEmail("admin@fitpro.com")) {
            AppUser admin = new AppUser();
            admin.setEmail("admin@fitpro.com");
            //UPDATED: Password is now encoded using BCrypt
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepo.save(admin);

            System.out.println(">>> ADMIN SEEDED: admin@fitpro.com (Encrypted) <<<");
        }

        // -----------------------------------------------------------
        // 2. SEED MEMBERSHIP PLANS (Products)
        // -----------------------------------------------------------
        if (planRepo.count() == 0) {
            MembershipPlan gold = new MembershipPlan();
            gold.setPlanName("Gold Plan");
            gold.setDurationInDays(30);
            gold.setPrice(5000.00);
            planRepo.save(gold);

            MembershipPlan diamond = new MembershipPlan();
            diamond.setPlanName("Diamond Elite");
            diamond.setDurationInDays(180);
            diamond.setPrice(15000.00);
            planRepo.save(diamond);

            System.out.println(">>> PLANS SEEDED (Gold & Diamond) <<<");
        }

        // -----------------------------------------------------------
        // 3. SEED TRAINERS (Staff)
        // -----------------------------------------------------------
        if (trainerRepo.count() == 0) {
            // Trainer 1: John Cena
            createTrainer("John Cena", "john@fitpro.com", "9876543210", "Weight Lifting");

            // Trainer 2: Brock Lesnar
            createTrainer("Brock Lesnar", "brock@fitpro.com", "1112223333", "MMA & Cardio");

            System.out.println(">>> TRAINERS SEEDED (John & Brock) <<<");
        }
    }

    // Helper method to create User + Trainer profile cleanly
    private void createTrainer(String name, String email, String phone, String spec) {
        // A. Create Login
        AppUser user = new AppUser();
        user.setEmail(email);
        // ✅ UPDATED: Password is now encoded using BCrypt
        user.setPassword(passwordEncoder.encode("trainer123"));
        user.setRole(Role.TRAINER);
        AppUser savedUser = userRepo.save(user);

        // B. Create Profile
        Trainer trainer = new Trainer();
        trainer.setTrainerName(name);
        trainer.setPhone(phone);
        trainer.setSpecialization(spec);
        trainer.setUser(savedUser);
        trainerRepo.save(trainer);
    }
}