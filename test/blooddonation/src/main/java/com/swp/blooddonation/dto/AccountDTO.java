package com.swp.blooddonation.dto;

import com.swp.blooddonation.enums.Gender;
import com.swp.blooddonation.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class AccountDTO {
    private Long id;
    private String email;
    private String phone;
    private Date birthDate;
    private String fullName;
    private Gender gender;
    private Role role;
    private String address;
}
