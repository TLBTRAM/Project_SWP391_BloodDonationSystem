package com.swp.blooddonation.entity;

import com.swp.blooddonation.enums.BloodType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Customer {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private Account account;

    // Từ Donor
    @Enumerated(EnumType.STRING)
    private BloodType bloodType;
    private LocalDate lastDonationDate;

    // Từ Recipient
    private String bloodTypeNeeded;
    private String hospitalName;
    private String medicalCondition;
}