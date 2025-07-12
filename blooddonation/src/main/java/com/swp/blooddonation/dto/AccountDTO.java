package com.swp.blooddonation.dto;

import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.Gender;
import com.swp.blooddonation.enums.RhType;
import com.swp.blooddonation.enums.Role;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
public class AccountDTO {

    private String email;
    private String phone;
    private String fullName;
    private Date birthDate;
    private Gender gender;
    private AddressDTO address;
    private LocalDate lastDonationDate;
    private BloodType bloodType;
    private RhType rhType;
}