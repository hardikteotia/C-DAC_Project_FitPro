package com.fitpro.backend.service;

import com.fitpro.backend.entity.Member;
import com.fitpro.backend.entity.Payment;
import com.fitpro.backend.repository.MemberRepository;
import com.fitpro.backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepo;

    @Autowired
    private MemberRepository memberRepo;

    // 1. RECORD PAYMENT & UPDATE DATES
    public Payment recordPayment(Long memberId, Double amount, String method) {
        Member member = memberRepo.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // A. Create Payment Record (For History)
        Payment payment = new Payment();
        payment.setAmount(amount);
        payment.setPaymentMethod(method);
        payment.setPaymentDate(LocalDate.now());
        payment.setMember(member);

        // B. SMART DATE LOGIC: Update Start/End Dates
        if (member.getMembershipPlan() != null) {
            int duration = member.getMembershipPlan().getDurationInDays();
            LocalDate today = LocalDate.now();

            // Scenario 1: New Member OR Plan Expired
            // Logic: Start Date = Today. End Date = Today + Duration.
            if (member.getEndDate() == null || member.getEndDate().isBefore(today)) {
                member.setStartDate(today);
                member.setEndDate(today.plusDays(duration));
            }
            // Scenario 2: Active Member (Paying Early)
            // Logic: Keep Start Date. Extend End Date by Duration.
            else {
                LocalDate currentEnd = member.getEndDate();
                member.setEndDate(currentEnd.plusDays(duration));
            }

            // Save Member with new dates
            memberRepo.save(member);
        }

        return paymentRepo.save(payment);
    }

    // 2. GET PAYMENT HISTORY (For Member & Admin)
    public List<Payment> getPaymentHistory(Long memberId) {
        return paymentRepo.findByMemberId(memberId);
    }
}