package com.fitpro.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Member {
    // ... existing fields ...
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String address;
    private LocalDate startDate;
    private LocalDate endDate;


    private boolean active = true; // Default is ACTIVE cuz they joined and if paid

    @ManyToOne
    @JoinColumn(name = "user_id")
    private AppUser user;

    @ManyToOne
    @JoinColumn(name = "plan_id")
    private MembershipPlan membershipPlan;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;
}