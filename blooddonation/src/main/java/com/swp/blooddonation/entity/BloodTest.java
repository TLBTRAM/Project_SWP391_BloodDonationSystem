package com.swp.blooddonation.entity;

import com.swp.blooddonation.enums.BloodTestStatus;
import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.RhType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class BloodTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "register_id")
    private Register register;

    private String result;

    @Enumerated(EnumType.STRING)
    private BloodTestStatus status = BloodTestStatus.PENDING;

    @Column(name = "blood_type")
    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "rh_type")
    private RhType rhType;


    @ManyToOne
    @JoinColumn(name = "medical_staff_id") // tên cột trong bảng blood_test
    private User medicalStaff;


    // Getters/Setters
}