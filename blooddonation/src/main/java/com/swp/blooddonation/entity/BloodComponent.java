package com.swp.blooddonation.entity;

import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.ComponentStatus;
import com.swp.blooddonation.enums.ComponentType;
import com.swp.blooddonation.enums.RhType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalDate;

@Entity
@Getter
@Setter
public class BloodComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ComponentType componentType; // RED_CELL, PLASMA, PLATELET

    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    @Enumerated(EnumType.STRING)
    private RhType rhType;

    private double volume; // (ml)

    private LocalDate collectedDate;
    private LocalDate expirationDate;

    @Enumerated(EnumType.STRING)
    private ComponentStatus status; // AVAILABLE, USED, EXPIRED

    @ManyToOne
    private BloodUnit fromBloodUnit;

    @ManyToOne
    private Register register; // Liên kết phiên hiến máu

    @ManyToOne
    private BloodRequestComponent bloodRequestComponent;
}
