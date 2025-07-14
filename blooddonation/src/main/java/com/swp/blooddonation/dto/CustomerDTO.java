package com.swp.blooddonation.dto;

import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.RhType;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class CustomerDTO {
    private Long id;
    private String fullName;
    private BloodType bloodType;
    private RhType rhType;
    public Date birthDate;
    private LocalDate lastDonationDate;
    private String address;
    private String phone;
    private String email;
}
