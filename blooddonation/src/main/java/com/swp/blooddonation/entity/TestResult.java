package com.swp.blooddonation.entity;

import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.RhType;
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
    private User customer;


    @Enumerated(EnumType.STRING)
    @Column(name = "type_id")
    private BloodType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "rh_type")
    private RhType rhType;

    @ManyToOne
    @JoinColumn(name = "staff_id")
    private User staff;

//    @ManyToOne
//    @JoinColumn(name = "appointment_id")
//    private Appointment appointment;

    @Column(nullable = false)
    private boolean passed;

    @OneToOne
    @JoinColumn(name = "blood_test_id", nullable = false)
    private BloodTest bloodTest;

}
