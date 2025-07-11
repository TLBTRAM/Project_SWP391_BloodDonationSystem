package com.swp.blooddonation.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.swp.blooddonation.dto.AddressDTO;
import com.swp.blooddonation.enums.Gender;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;


@Getter
@Setter
public class RegisRequest {
    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Email không được để trống")
    public String email;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu tối thiểu 6 ký tự")
    public String password;

    @NotBlank(message = "Số điện thoại không được để trống")
    public String phone;

    @NotBlank(message = "Họ tên không được để trống")
    public String fullName;

    @Valid
    public AddressDTO address;

    public Gender gender;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @JsonProperty("birthDate")
    public Date birthDate;
}
