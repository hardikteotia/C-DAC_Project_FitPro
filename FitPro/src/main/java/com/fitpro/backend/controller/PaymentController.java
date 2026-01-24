package com.fitpro.backend.controller;

import com.fitpro.backend.entity.Payment;
import com.fitpro.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // 1. ADMIN RECORDS PAYMENT
    // URL: POST http://localhost:8080/api/payments?memberId=1&amount=5000&method=Cash
    @PostMapping
    public Payment recordPayment(@RequestParam Long memberId,
                                 @RequestParam Double amount,
                                 @RequestParam String method) {
        return paymentService.recordPayment(memberId, amount, method);
    }

    // 2. VIEW HISTORY (Admin checks a user, or User checks themselves)
    // URL: GET http://localhost:8080/api/payments/1
    @GetMapping("/{memberId}")
    public List<Payment> getHistory(@PathVariable Long memberId) {
        return paymentService.getPaymentHistory(memberId);
    }
}