package com.swp.blooddonation.dto;

import com.swp.blooddonation.enums.Gender;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;


@Getter
@Setter
public class AccountUpdateDTO {
    private String fullName;
    private String phone;
    private String address;
    private Date YoB;
    private Gender gender;
}
