package com.swp.blooddonation.entity;

import com.swp.blooddonation.enums.BloodRequestStatus;
import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.RhType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class WholeBloodRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Account requester; // người gửi yêu cầu (Donor / Medical Staff)

    @ManyToOne
    private Patient patient;   // bệnh nhân cần máu

    @Enumerated(EnumType.STRING)
    private BloodType bloodType;


    @Enumerated(EnumType.STRING)
    private RhType rhType;

    private int requiredVolume;
    private String hospitalName;
    private String medicalCondition;

    private LocalDate requestDate;



    @Enumerated(EnumType.STRING)
    private BloodRequestStatus status;; // PENDING, APPROVED, FULFILLED
}
