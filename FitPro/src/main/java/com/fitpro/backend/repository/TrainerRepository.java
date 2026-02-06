package com.fitpro.backend.repository;

import com.fitpro.backend.entity.AppUser;
import com.fitpro.backend.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    List<Trainer> findByActiveTrue();

    //Finds the Trainer Profile linked to a Login Account
    Optional<Trainer> findByUser(AppUser user);
}