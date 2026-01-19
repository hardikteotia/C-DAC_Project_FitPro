package com.fitpro.backend.repository;

import com.fitpro.backend.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    // Useful for dropdowns or validation
}