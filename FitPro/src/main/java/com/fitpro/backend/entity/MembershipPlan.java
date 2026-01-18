package com.fitpro.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class MembershipPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String planName; // e.g., "Gold", "Silver"

    private Double price;    // e.g., 5000.00

    private Integer durationInDays; // e.g., 30, 365
}
