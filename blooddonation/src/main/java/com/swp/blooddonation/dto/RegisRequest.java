package com.swp.blooddonation.dto;

import com.swp.blooddonation.enums.Gender;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;


@Getter
@Setter
public class RegisRequest {
    public String email;
    public String password;
    public String phone;
    public String fullName;
    public String address;
    public Gender gender;
    public Date yoB;
}
