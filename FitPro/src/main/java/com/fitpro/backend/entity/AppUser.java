package com.fitpro.backend.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data //to generate getters and setters automatically
public class AppUser {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

}
