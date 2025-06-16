package com.swp.blooddonation.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class TestResultResponseDTO {

    private Long id;

    private String bloodType;

    private boolean hiv;         // hoặc hivNegative nếu bạn muốn để là âm tính
    private boolean hbv;
    private boolean hcv;
    private boolean syphilis;

    private double hemoglobin;
    private String bloodPressure;
    private double bodyTemperature;

    private boolean isEligible;

    private String notes;
    private LocalDate testDate;

    private Long sampleId;
    private String testedByStaffName;
    private String donorName;
}
