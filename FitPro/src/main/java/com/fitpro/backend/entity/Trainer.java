package com.fitpro.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String trainerName;

    private String specialization;

    private String phone;

    @OneToOne
    @JoinColumn(name = "user_id")
    private AppUser user;

    @OneToMany(mappedBy = "trainer")
    // This stops the infinite loop!
    // It says: "Show the members, but don't show the 'trainer' field inside them."
    @JsonIgnoreProperties("trainer")
    private List<Member> members;
}
