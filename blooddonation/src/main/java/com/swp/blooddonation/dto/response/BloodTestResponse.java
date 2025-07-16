package com.swp.blooddonation.dto.response;

import com.swp.blooddonation.enums.BloodTestStatus;
import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.RhType;
import lombok.Data;

import java.time.LocalDate;


@Data
public class BloodTestResponse {
    private Long id;
    private String result;
    private boolean passed;
    private LocalDate testDate;
    private String bloodPressure; // huyết áp
    private String heartRate; // nhịp tim
    private Long testedById; // id nhân viên thực hiện
    private String testedByName; // tên nhân viên thực hiện
    private BloodTestStatus status;
    private BloodType bloodType;
    private RhType rhType;
    private Long customerId; // id người hiến máu
    private String customerName; // tên người hiến máu
}
