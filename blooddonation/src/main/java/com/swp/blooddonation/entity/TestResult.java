package com.swp.blooddonation.entity;

import com.swp.blooddonation.enums.BloodType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDate;
import java.util.Date;

@Entity
@Getter
@Setter
public class TestResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long testId;

    private LocalDate testDate;
    private String bloodPressure;
    private String heartRate;
    private String result;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;


    @Enumerated(EnumType.STRING)
    @Column(name = "type_id")
    private BloodType type;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private MedicalStaff staff;

    @ManyToOne
    @JoinColumn(name = "register_id")
    private Register register;

}
