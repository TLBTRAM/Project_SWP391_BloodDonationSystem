package com.swp.blooddonation.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.swp.blooddonation.enums.Gender;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;


@Getter
@Setter


// dùng để đăng ký tài khoản người dùng
public class RegisRequest {
    public String email;
    public String password;
    public String phone;
    public String fullName;
    public String address;
    public Gender gender;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonProperty("birthDate")
    public Date birthDate;
}
