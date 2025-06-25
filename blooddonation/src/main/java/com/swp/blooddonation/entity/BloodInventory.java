package com.swp.blooddonation.entity;

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

    @ManyToOne
    @JoinColumn(name = "type_id")
    private BloodType type;
}
