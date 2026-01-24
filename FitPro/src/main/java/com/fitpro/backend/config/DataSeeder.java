package com.fitpro.backend.config;

import com.fitpro.backend.entity.AppUser;
import com.fitpro.backend.entity.Role;
import com.fitpro.backend.repository.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

//@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AppUserRepository repo;

    @Override
    public void run(String... args) throws Exception{
        //here condition checking for ADMIN Already Exists to prevent duplicates

        if (repo.count() == 0){
            AppUser admin = new AppUser();
            admin.setEmail("admin@fitpro.com");
            admin.setPassword("admin123");//it will be encrypted
            admin.setRole(Role.ADMIN);

            repo.save(admin);
            System.out.println("----------- DATA SEEDER ------------");
            System.out.println("Default Admin created: admin@fitpro.com");
            System.out.println("------------------------------------");
        }

    }

}
