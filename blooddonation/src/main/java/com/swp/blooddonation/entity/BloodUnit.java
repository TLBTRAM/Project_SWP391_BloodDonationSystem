package com.swp.blooddonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.BloodUnitStatus;
import com.swp.blooddonation.enums.RhType;
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

    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    @Enumerated(EnumType.STRING)
    private RhType rhType;

    private int totalVolume;         // Dung tích toàn phần (mặc định 450ml)
//    private Integer redCellVolume;   // hồng cầu (ml)
//    private Integer plasmaVolume;    // huyết tương (ml)
//    private Integer plateletVolume;  // tiểu cầu (ml)

    private LocalDate collectedDate;
    private LocalDate expirationDate;
    @Enumerated(EnumType.STRING)
    private BloodUnitStatus status; // COLLECTED, SEPARATED, EXPIRED

    @ManyToOne
    @JsonIgnore
    private User donor;

    @ManyToOne
    @JsonIgnore
    private User collectedBy;

    @ManyToOne
    @JoinColumn(name = "whole_blood_request_id")
    @JsonIgnore
    private WholeBloodRequest wholeBloodRequest;

}

