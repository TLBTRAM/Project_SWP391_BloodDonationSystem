package com.swp.blooddonation.dto;

import com.swp.blooddonation.enums.Gender;
import com.swp.blooddonation.enums.Role;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class AccountDTO {
    private Long id;
    private String email;
    private String phone;
    private String fullName;
    private Date birthDate;
    private Gender gender;
    private Role role;
    private String address;
}