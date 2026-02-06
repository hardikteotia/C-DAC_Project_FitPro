package com.fitpro.backend.controller;

import com.fitpro.backend.entity.Member;
import com.fitpro.backend.entity.Trainer;
import com.fitpro.backend.service.MemberService;
import com.fitpro.backend.service.TrainerService;
import com.fitpro.backend.repository.PaymentRepository; // 👈 Import this!
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*") // Ensure React can access this
public class AdminController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private TrainerService trainerService;

    // 👇 Inject the Payment Repo so we can count the money
    @Autowired
    private PaymentRepository paymentRepository;

    // --- DASHBOARD STATS ---
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalMembers = memberService.getAllMembers().size();
        long activeTrainers = trainerService.getAllTrainers().size();

        //Ask the database for the sum of actual payments
        double totalRevenue = paymentRepository.calculateTotalRevenue();

        stats.put("totalMembers", totalMembers);
        stats.put("activeTrainers", activeTrainers);
        stats.put("totalRevenue", totalRevenue);

        return ResponseEntity.ok(stats);
    }

    // --- MEMBER MANAGEMENT ---
    @GetMapping("/members")
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    @DeleteMapping("/members/{id}")
    public ResponseEntity<String> deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
        return ResponseEntity.ok("Member deleted successfully");
    }

    @PutMapping("/members/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member member) {
        return ResponseEntity.ok(memberService.updateMember(id, member));
    }

    // --- TRAINER MANAGEMENT ---
    @GetMapping("/trainers")
    public List<Trainer> getAllTrainers() {
        return trainerService.getAllTrainers();
    }

    @DeleteMapping("/trainers/{id}")
    public ResponseEntity<String> deleteTrainer(@PathVariable Long id) {
        trainerService.deleteTrainer(id);
        return ResponseEntity.ok("Trainer deleted successfully");
    }

    @PutMapping("/trainers/{id}")
    public ResponseEntity<Trainer> updateTrainer(@PathVariable Long id, @RequestBody Trainer trainer) {
        return ResponseEntity.ok(trainerService.updateTrainer(id, trainer));
    }
}