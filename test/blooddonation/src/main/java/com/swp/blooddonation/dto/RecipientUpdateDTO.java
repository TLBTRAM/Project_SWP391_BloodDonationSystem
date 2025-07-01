package com.swp.blooddonation.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecipientUpdateDTO {
    private String bloodTypeNeeded;
    private String hospitalName;
    private String medicalCondition;
}
