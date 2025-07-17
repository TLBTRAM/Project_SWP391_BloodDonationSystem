package com.swp.blooddonation.dto.request;

import com.swp.blooddonation.dto.AddressDTO;
import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.Gender;
import com.swp.blooddonation.enums.RhType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.Valid;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ComponentBloodRequestRequest {

    @NotBlank
    private String fullName;

    @NotNull
    private Gender gender;

    @NotNull
    private LocalDate dateOfBirth;

    @NotBlank
    private String phone;

    @Valid
    @NotNull
    private AddressDTO patientAddress;

    @NotNull
    private BloodType bloodType;

    @NotNull
    private RhType rhType;

    @NotBlank
    private String hospitalName;

    @NotBlank
    private String medicalCondition;

    @Min(0)
    private int redCellQuantity;

    @Min(0)
    private int plasmaQuantity;

    @Min(0)
    private int plateletQuantity;
}
