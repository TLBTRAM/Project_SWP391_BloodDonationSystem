package com.swp.blooddonation.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class TestResultDTO {
    private Long id;
    private Date testDate;
    private String bloodPressure;
    private String heartRate;
    private String result;
    private Long customerId;
    private Long typeId;

}