package com.fitpro.backend.config;

import com.fitpro.backend.entity.*;
import com.fitpro.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class MasterDataSeeder implements CommandLineRunner {

    @Autowired
    private MembershipPlanRepository planRepo;
    @Autowired
    private TrainerRepository trainerRepo;
    @Autowired
    private AppUserRepository userRepo;

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Membership Plans
        if (planRepo.count() == 0) {
            MembershipPlan gold = new MembershipPlan();
            gold.setPlanName("Gold Plan");
            gold.setDurationInDays(30);
            gold.setPrice(5000.00);
            planRepo.save(gold);

            MembershipPlan silver = new MembershipPlan();
            silver.setPlanName("Silver Plan");
            silver.setDurationInDays(90);
            silver.setPrice(12000.00);
            planRepo.save(silver);
            
            System.out.println(">>> PLANS SEEDED <<<");
        }

        // 2. Seed Trainers (Requires creating a User first!)
        if (trainerRepo.count() == 0) {
            // Create Login for Trainer
            AppUser trainerUser = new AppUser();
            trainerUser.setEmail("trainer@fitpro.com");
            trainerUser.setPassword("trainer123");
            trainerUser.setRole(Role.TRAINER);
            userRepo.save(trainerUser);

            // Create Profile
            Trainer t = new Trainer();
            t.setTrainerName("John Cena");
            t.setSpecialization("Weight Lifting");
            t.setPhone("9876543210");
            t.setUser(trainerUser);
            trainerRepo.save(t);
            
            System.out.println(">>> TRAINERS SEEDED <<<");
        }
    }
}
