package com.swp.blooddonation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MedicalStaffDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    public Date YoB;
    private String department;
    private String hospital;
}