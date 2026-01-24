package com.fitpro.backend.service;

import com.fitpro.backend.entity.MembershipPlan;
import com.fitpro.backend.repository.MemberRepository;
import com.fitpro.backend.repository.MembershipPlanRepository;
import com.fitpro.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private MembershipPlanRepository planRepo;

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private PaymentRepository paymentRepo;

    // ---------------------------------------------------
    // 1. PLAN MANAGEMENT (Only Admin does this)
    // ---------------------------------------------------

    public MembershipPlan createPlan(MembershipPlan plan) {
        // 1. Check for duplicate
        if (planRepo.existsByPlanName(plan.getPlanName())) {
            throw new RuntimeException("Plan already exists with name: " + plan.getPlanName());
        }
        // 2. Save if unique
        return planRepo.save(plan);
    }

    public MembershipPlan updatePlan(Long id, MembershipPlan updatedPlan) {
        MembershipPlan plan = planRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        plan.setPlanName(updatedPlan.getPlanName());
        plan.setPrice(updatedPlan.getPrice());
        plan.setDurationInDays(updatedPlan.getDurationInDays());

        return planRepo.save(plan);
    }

    public void deletePlan(Long id) {
        // Warning: In a real app, don't delete a plan if members are using it!
        // For now, we allow it.
        planRepo.deleteById(id);
    }

    // ---------------------------------------------------
    // 2. DASHBOARD STATS (The "CEO View")
    // ---------------------------------------------------
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalMembers = memberRepo.count();
        long totalPlans = planRepo.count();

        // Calculate Total Revenue (Sum of all payments)
        Double totalRevenue = paymentRepo.findAll().stream()
                .mapToDouble(p -> p.getAmount())
                .sum();

        stats.put("totalMembers", totalMembers);
        stats.put("totalPlans", totalPlans);
        stats.put("totalRevenue", totalRevenue);

        return stats;
    }
}