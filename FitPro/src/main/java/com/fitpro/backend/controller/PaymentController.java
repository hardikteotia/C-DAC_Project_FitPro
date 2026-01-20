package com.fitpro.backend.controller;

import com.fitpro.backend.entity.Member;
import com.fitpro.backend.entity.Payment;
import com.fitpro.backend.repository.MemberRepository;
import com.fitpro.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepo;
    @Autowired
    private MemberRepository memberRepo;

    // Record Payment (POST /api/payments?memberId=1&amount=5000&method=UPI)
    @PostMapping
    public Payment recordPayment(@RequestParam Long memberId, @RequestParam Double amount, @RequestParam String method) {
        Member member = memberRepo.findById(memberId).orElseThrow(() -> new RuntimeException("Member not found"));

        Payment payment = new Payment();
        payment.setAmount(amount);
        payment.setPaymentMethod(method);
        payment.setPaymentDate(LocalDate.now());
        payment.setMember(member);

        return paymentRepo.save(payment);
    }

    // Get History (GET /api/payments/1)
    @GetMapping("/{memberId}")
    public List<Payment> getHistory(@PathVariable Long memberId) {
        return paymentRepo.findByMemberId(memberId);
    }
}
