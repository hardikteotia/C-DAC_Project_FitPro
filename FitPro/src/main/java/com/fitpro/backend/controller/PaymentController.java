package com.fitpro.backend.controller;

import com.fitpro.backend.entity.Payment;
import com.fitpro.backend.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // 👇 Inject Razorpay Keys from application.properties
    @Value("${razorpay.api.key}")
    private String apiKey;

    @Value("${razorpay.api.secret}")
    private String apiSecret;

    // -------------------------------------------------------------------------
    // EXISTING METHODS (Manual Cash Payments)
    // -------------------------------------------------------------------------

    // 1. ADMIN RECORDS PAYMENT (Manual)
    @PostMapping
    public Payment recordPayment(@RequestParam Long memberId,
                                 @RequestParam Double amount,
                                 @RequestParam String method) {
        return paymentService.recordPayment(memberId, amount, method);
    }

    // 2. VIEW HISTORY
    @GetMapping("/{memberId}")
    public List<Payment> getHistory(@PathVariable Long memberId) {
        return paymentService.getPaymentHistory(memberId);
    }

    // -------------------------------------------------------------------------
    // NEW RAZORPAY METHODS (Online Payments)
    // -------------------------------------------------------------------------

    // 3. CREATE RAZORPAY ORDER (Frontend calls this before opening popup)
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            // Convert amount to integer (and to paise)
            Double amountDouble = Double.parseDouble(data.get("amount").toString());
            int amountInPaise = (int) (amountDouble * 100);

            RazorpayClient client = new RazorpayClient(apiKey, apiSecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            Order order = client.orders.create(orderRequest);

            return ResponseEntity.ok(order.toString());

        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body("Error creating Razorpay order: " + e.getMessage());
        }
    }

    // 4. VERIFY PAYMENT (Called after user pays successfully)
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, Object> data) {
        try {
            String orderId = (String) data.get("razorpay_order_id");
            String paymentId = (String) data.get("razorpay_payment_id");
            String signature = (String) data.get("razorpay_signature");

            // Get Member ID and Amount to save to DB
            Long memberId = Long.parseLong(data.get("memberId").toString());
            Double amount = Double.parseDouble(data.get("amount").toString());

            // Verify Signature
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);

            boolean isValid = Utils.verifyPaymentSignature(options, apiSecret);

            if (isValid) {
                // ✅ SUCCESS! Save to Database automatically
                paymentService.recordPayment(memberId, amount, "Razorpay (Online)");
                return ResponseEntity.ok("Payment Verified and Saved");
            } else {
                return ResponseEntity.badRequest().body("Invalid Payment Signature");
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Verification failed: " + e.getMessage());
        }
    }
}