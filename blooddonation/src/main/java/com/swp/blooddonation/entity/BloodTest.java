package com.swp.blooddonation.entity;

import com.swp.blooddonation.enums.BloodTestStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class BloodTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Appointment appointment;

    private String result;

    @Enumerated(EnumType.STRING)
    private BloodTestStatus status = BloodTestStatus.PENDING;

    private LocalDate createdAt;
    // Getters/Setters
}