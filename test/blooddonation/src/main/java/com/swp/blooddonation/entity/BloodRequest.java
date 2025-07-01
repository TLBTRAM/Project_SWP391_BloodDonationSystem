package com.swp.blooddonation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class BloodRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime requestDate;
    private String requestedBloodType;
    private int amount;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private String hospital;
    private String status;

    @ManyToOne
    @JoinColumn(name = "medical_staff_id")
    private Account medicalStaff;
}
