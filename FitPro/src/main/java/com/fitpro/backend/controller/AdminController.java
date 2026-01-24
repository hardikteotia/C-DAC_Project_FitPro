package com.fitpro.backend.controller;

import com.fitpro.backend.dto.MemberRegistrationRequest; // Import this!
import com.fitpro.backend.entity.Member;
import com.fitpro.backend.entity.MembershipPlan;
import com.fitpro.backend.entity.Trainer;
import com.fitpro.backend.service.AdminService;
import com.fitpro.backend.service.MemberService;
import com.fitpro.backend.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // --- ADD THESE TWO SERVICES ---
    @Autowired
    private MemberService memberService;
    @Autowired
    private TrainerService trainerService;

    // =======================================================
    // 1. DASHBOARD & PLANS (The Code you already had)
    // =======================================================

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return adminService.getDashboardStats();
    }

    @PostMapping("/plans")
    public MembershipPlan createPlan(@RequestBody MembershipPlan plan) {
        return adminService.createPlan(plan);
    }

    @PutMapping("/plans/{id}")
    public MembershipPlan updatePlan(@PathVariable Long id, @RequestBody MembershipPlan plan) {
        return adminService.updatePlan(id, plan);
    }

    @DeleteMapping("/plans/{id}")
    public String deletePlan(@PathVariable Long id) {
        adminService.deletePlan(id);
        return "Plan deleted successfully";
    }

    // =======================================================
    // 2. MEMBER MANAGEMENT (Supreme Powers)
    // =======================================================

    // Admin sees ALL members
    @GetMapping("/members")
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    // Admin Creates a Member (Walk-in Client)
    @PostMapping("/members")
    public Member createMember(@RequestBody MemberRegistrationRequest request) {
        return memberService.registerMember(request);
    }

    // Admin Updates Member (Fixing mistakes)
    @PutMapping("/members/{id}")
    public Member updateMember(@PathVariable Long id, @RequestBody Member member) {
        return memberService.updateMember(id, member);
    }

    // Admin Bans Member
    @DeleteMapping("/members/{id}")
    public String deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return "Member deleted by Admin.";
    }

    // =======================================================
    // 3. TRAINER MANAGEMENT (Hiring & Firing)
    // =======================================================

    // Admin sees ALL trainers
    @GetMapping("/trainers")
    public List<Trainer> getAllTrainers() {
        return trainerService.getAllTrainers();
    }

    // Admin Hires a Trainer
    @PostMapping("/trainers")
    public Trainer createTrainer(@RequestBody Trainer trainer) {
        return trainerService.createTrainer(trainer);
    }

    // Admin Updates Trainer Info
    @PutMapping("/trainers/{id}")
    public Trainer updateTrainer(@PathVariable Long id, @RequestBody Trainer trainer) {
        return trainerService.updateTrainer(id, trainer);
    }

    // Admin Fires a Trainer
    @DeleteMapping("/trainers/{id}")
    public String deleteTrainer(@PathVariable Long id) {
        trainerService.deleteTrainer(id);
        return "Trainer fired (students unassigned).";
    }
}