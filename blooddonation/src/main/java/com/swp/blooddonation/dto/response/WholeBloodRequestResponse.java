package com.swp.blooddonation.dto.response;

import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.RhType;
import com.swp.blooddonation.enums.BloodRequestStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class WholeBloodRequestResponse {
    private Long id;
    private String fullName;
    private String address;
    private BloodType bloodType;
    private RhType rhType;
    private int requiredVolume;
    private String hospitalName;
    private String medicalCondition;
    private LocalDate requestDate;
    private BloodRequestStatus status;
    private String phone;
    private String gender;
} 