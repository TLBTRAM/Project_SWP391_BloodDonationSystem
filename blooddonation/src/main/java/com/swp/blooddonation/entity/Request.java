package com.swp.blooddonation.entity;

import com.swp.blooddonation.enums.BloodType;
import jakarta.persistence.*;


import java.util.Date;

@Entity
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    private Double volume;
    private Date requestDate;
    private String status;
    private String note;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Account account;

    @Enumerated(EnumType.STRING)
    @Column(name = "blood_type")
    private BloodType type;
}
