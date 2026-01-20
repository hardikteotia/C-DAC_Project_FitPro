package com.fitpro.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;
    private String paymentMethod; // e.g., "Cash", "UPI"
    private LocalDate paymentDate;
    
    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;
}
