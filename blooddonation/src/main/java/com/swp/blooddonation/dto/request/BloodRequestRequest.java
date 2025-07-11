package com.swp.blooddonation.dto.request;

import com.swp.blooddonation.dto.AddressDTO;
import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.Gender;
import com.swp.blooddonation.enums.RhType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BloodRequestRequest {
    private Long patientId; // optional nếu đã có

    private String fullName;
    private LocalDate dateOfBirth;
    private AddressDTO patientAddress;
    private String phone;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    @Enumerated(EnumType.STRING)
    private RhType rhType;

    private int requiredVolume;

    private String hospitalName;
    private String medicalCondition;
}
