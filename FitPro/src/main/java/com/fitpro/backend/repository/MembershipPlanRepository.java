package com.fitpro.backend.repository;

import com.fitpro.backend.entity.MembershipPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembershipPlanRepository extends JpaRepository<MembershipPlan, Long> {
    boolean existsByPlanName(String planName);
}