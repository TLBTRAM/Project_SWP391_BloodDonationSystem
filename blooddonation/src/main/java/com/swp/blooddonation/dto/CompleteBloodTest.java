package com.swp.blooddonation.dto;

import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.RhType;
import lombok.Data;

@Data
public class CompleteBloodTest {
//    private Long bloodTestId;
//    private String bloodType;
//    private String rhFactor;
//    private String hbsAg;
//    private String antiHCV;
//    private String antiHIV1;
//    private String antiHIV2;
//    private String syphilis;
//    private String malaria;
//    private String result;
//    private String note;
//
//    public CompleteBloodTest() {
//        // Default constructor
//    }


    private String result;
    private boolean passed;
    private BloodType bloodType;
    private RhType rhType;
    private String bloodPressure;
    private String heartRate;
}

