package com.swp.blooddonation.entity;

import com.swp.blooddonation.enums.BloodType;
import jakarta.persistence.*;


import java.util.Date;

@Entity
public class BloodInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long inventoryId;

    private Date collectDate;
    private Date expiryDate;
    private Double volume;

    @ManyToOne
    @JoinColumn(name = "register_id")
    private Register register;


    @Enumerated(EnumType.STRING)
    @Column(name = "blood_type")
    private BloodType bloodType;
}
