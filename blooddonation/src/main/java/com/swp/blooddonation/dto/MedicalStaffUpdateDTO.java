package com.swp.blooddonation.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MedicalStaffUpdateDTO {
    private AccountUpdateDTO account;
    private String department;
    private String hospital;
}
