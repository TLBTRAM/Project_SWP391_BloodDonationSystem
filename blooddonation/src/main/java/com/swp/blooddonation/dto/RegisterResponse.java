package com.swp.blooddonation.dto;

import com.swp.blooddonation.enums.Gender;
import com.swp.blooddonation.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse {
    private Long id;
    private String email;
    private String phone;
    private String fullName;
    private LocalDateTime createAt;
    private Gender gender;
    private Role role;
    private boolean enabled;
}
