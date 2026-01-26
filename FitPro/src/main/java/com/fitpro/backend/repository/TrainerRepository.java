package com.fitpro.backend.repository;

import com.fitpro.backend.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainerRepository extends JpaRepository<Trainer, Long> {
    List<Trainer> findByActiveTrue(); // Fetch only active trainers
}