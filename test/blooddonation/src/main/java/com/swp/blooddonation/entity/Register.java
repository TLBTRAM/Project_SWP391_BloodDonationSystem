package com.swp.blooddonation.entity;

import jakarta.persistence.*;
import org.apache.catalina.User;


import java.sql.Time;
import java.util.Date;
import java.util.List;

@Entity
public class Register {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long registerId;

    private Date registerDate;
    private Time time;
    private String status;
    private String note;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

    @OneToMany(mappedBy = "register")
    private List<TestResult> testResults;

    @OneToMany(mappedBy = "register")
    private List<BloodInventory> bloodInventories;
}
