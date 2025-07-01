package com.swp.blooddonation.entity;

import com.swp.blooddonation.enums.BloodTestStatus;
import com.swp.blooddonation.enums.BloodType;
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

    @Column(name = "blood_type")
    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    private LocalDate createdAt;

    @ManyToOne
    @JoinColumn(name = "medical_staff_id") // tên cột trong bảng blood_test
    private Account medicalStaff;

    // Getters/Setters
}