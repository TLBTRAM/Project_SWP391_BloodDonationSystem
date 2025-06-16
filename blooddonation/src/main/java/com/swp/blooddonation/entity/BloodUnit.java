package com.swp.blooddonation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class BloodUnit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String unitCode; // Mã túi máu

    @ManyToOne
    private BloodSample sample;

    private String bloodType;
    private int volume; // ml
    private String status; // Stored, Used, Expired
    private LocalDate expirationDate;
    private String storageLocation;
}
