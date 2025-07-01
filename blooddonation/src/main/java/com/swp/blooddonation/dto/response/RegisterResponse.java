package com.swp.blooddonation.dto.response;

import com.swp.blooddonation.enums.Gender;
import com.swp.blooddonation.enums.RegisterStatus;
import com.swp.blooddonation.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse {
    private Long id;

    // Thông tin người đăng ký
    private String email;
    private String phone;
    private String fullName;
    private Gender gender;
    private Role role;
    private boolean enabled;

    // Thông tin đơn đăng ký
    private LocalDate registerDate;
    private String slotName;
    private RegisterStatus status;
    private String note;
    private LocalDateTime createdAt;

    // Nếu bị từ chối
    private String rejectionReason;
    private String rejectedByName;
}
