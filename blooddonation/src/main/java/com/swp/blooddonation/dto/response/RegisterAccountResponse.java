package com.swp.blooddonation.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.swp.blooddonation.enums.Gender;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
public class RegisterAccountResponse {
    private Long id;

    // Thông tin cơ bản
    private String email;
    private String phone;
    private String fullName;
    private Gender gender;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date birthDate;

    // Địa chỉ (dạng chuỗi đầy đủ)
    private String fullAddress;

    // Trạng thái tài khoản
    private boolean enabled;
    private LocalDateTime createdAt;
}
