package com.swp.blooddonation.entity;

import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.BloodUnitStatus;
import jakarta.persistence.*;

import java.time.LocalDate;

public class BloodUnit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    private LocalDate collectedDate;
    private String bloodPressure;
    private String heartRate;

    @Enumerated(EnumType.STRING)
    private BloodUnitStatus status;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private Customer donor;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private MedicalStaff collectedBy;

}
