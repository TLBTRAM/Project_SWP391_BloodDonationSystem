package com.swp.blooddonation.dto.response;

import com.swp.blooddonation.enums.BloodTestStatus;
import com.swp.blooddonation.enums.BloodType;
import lombok.Data;

import java.time.LocalDate;


@Data
public class BloodTestResponse {
    private Long id;
    private String result;
    private boolean passed;
    private LocalDate testDate;
    private Long testedById; // id nhân viên thực hiện
    private String testedByName; // tên nhân viên thực hiện
    private BloodTestStatus status;
    private BloodType bloodType;
}
