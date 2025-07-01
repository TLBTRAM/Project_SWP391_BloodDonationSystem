package com.swp.blooddonation.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BloodRequestDTO {
    private Long id;
    private String bloodTypeNeeded;
    private String hospitalName;
    private String medicalCondition;
    private Integer amount;
    private LocalDate createdDate;

    private Long customerId;
    private String status;
}
