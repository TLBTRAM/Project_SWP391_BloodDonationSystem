package com.swp.blooddonation.dto.response;

import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.RhType;
import com.swp.blooddonation.enums.BloodRequestStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BloodRequestComponentResponse {
    private Long id;
    private BloodType bloodType;
    private RhType rhType;
    private String hospitalName;
    private String medicalCondition;
    private LocalDateTime requestDate;
    private BloodRequestStatus status;
    private int redCellQuantity;
    private int plasmaQuantity;
    private int plateletQuantity;
} 