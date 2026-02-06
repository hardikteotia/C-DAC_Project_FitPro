package com.fitpro.backend.repository;

import com.fitpro.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByMemberId(Long memberId);

    // Here It sums up all the amount values in the payment table.
    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p")
    Double calculateTotalRevenue();
}