package com.swp.blooddonation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class TestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bloodType;

    private boolean hbv;
    private boolean hcv;
    private boolean hiv;
    private boolean syphilis;

    private double hemoglobin;
    private String bloodPressure;
    private double bodyTemperature;

    private boolean isEligible;

    private LocalDate testDate;

    @ManyToOne
    @JoinColumn(name = "tested_by", nullable = false)
    private MedicalStaff testedBy;

    @OneToOne
    @JoinColumn(name = "sample_id", nullable = false)
    private BloodSample sample;

    @ManyToOne
    @JoinColumn(name = "blood_type_id", nullable = true)
    private BloodType type;

    @ManyToOne
    @JoinColumn(name = "register_id", nullable = false)
    private Register register;
}
