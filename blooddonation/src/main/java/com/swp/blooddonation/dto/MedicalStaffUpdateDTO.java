package com.swp.blooddonation.dto;

import com.swp.blooddonation.enums.Gender;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class MedicalStaffUpdateDTO {
    private AccountUpdateDTO account;
    private String department;
    private String hospital;
}
