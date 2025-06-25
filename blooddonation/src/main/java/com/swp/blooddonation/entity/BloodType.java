package com.swp.blooddonation.entity;

import jakarta.persistence.*;


import java.util.List;

@Entity
public class BloodType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long typeId;

    private String typeCate;
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Account account;

    @OneToMany(mappedBy = "type")
    private List<BloodInventory> bloodInventories;

    @OneToMany(mappedBy = "type")
    private List<TestResult> testResults;

    @OneToMany(mappedBy = "type")
    private List<Request> requests;
}

