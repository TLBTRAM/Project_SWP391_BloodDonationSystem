package com.swp.blooddonation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RecipientDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String bloodTypeNeeded;
    private String hospitalName;
    private String medicalCondition;
}