package com.fitpro.backend.controller;

import com.fitpro.backend.entity.MembershipPlan;
import com.fitpro.backend.repository.MembershipPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class MembershipPlanController {

    @Autowired
    private MembershipPlanRepository planRepo;

    // 1. Get All Plans (Public)
    @GetMapping
    public List<MembershipPlan> getAllPlans() {
        return planRepo.findAll();
    }

    // 2. Create Plan (Admin Only)
    @PostMapping
    public MembershipPlan createPlan(@RequestBody MembershipPlan plan) {
        return planRepo.save(plan);
    }

    // 3. Update Plan (Admin Only) - e.g., Change Price
    @PutMapping("/{id}")
    public ResponseEntity<MembershipPlan> updatePlan(@PathVariable Long id, @RequestBody MembershipPlan planDetails) {
        return planRepo.findById(id).map(plan -> {
            //Updated to match Entity fields exactly
            plan.setPlanName(planDetails.getPlanName());
            plan.setPrice(planDetails.getPrice());
            plan.setDurationInDays(planDetails.getDurationInDays());

            return ResponseEntity.ok(planRepo.save(plan));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 4. Delete Plan (Admin Only)
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletePlan(@PathVariable Long id) {
        return planRepo.findById(id).map(plan -> {
            planRepo.delete(plan);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}