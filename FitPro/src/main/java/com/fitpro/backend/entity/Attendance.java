package com.fitpro.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private String status; // e.g., "Present", "Absent"

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;
}
