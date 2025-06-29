package com.swp.blooddonation.dto.request;

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
    public Date yoB;
}
