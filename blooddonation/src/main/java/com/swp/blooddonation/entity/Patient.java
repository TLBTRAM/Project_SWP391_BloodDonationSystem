package com.swp.blooddonation.entity;

import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.RhType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private LocalDate dateOfBirth;
    private String address;

    @Enumerated(EnumType.STRING)
    private BloodType bloodType; // optional
    @Enumerated(EnumType.STRING)
    private RhType rhType;

    private String hospitalName;
    private String medicalCondition;

    @OneToMany(mappedBy = "patient")
    private List<BloodRequest> requests; // Liên kết các yêu cầu truyền máu
}
