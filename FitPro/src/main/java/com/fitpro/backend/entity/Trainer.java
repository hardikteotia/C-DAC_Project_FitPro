package com.fitpro.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Trainer {
    // ... existing fields ...
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trainerName;
    private String phone;
    private String specialization;

    // 👇 ADD THIS FIELD
    private boolean active = true; // Default is ACTIVE

    @OneToOne
    @JoinColumn(name = "user_id")
    private AppUser user;

    // Remove the List<Member> members; if you don't want to mess with JsonIgnore,
    // OR keep it if it's working for you.
    // Just ensure the new 'active' field is added below existing fields.
    @OneToMany(mappedBy = "trainer")
    @JsonIgnore
    private List<Member> members;
}