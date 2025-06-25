package com.swp.blooddonation.dto;

import com.swp.blooddonation.enums.Gender;
import com.swp.blooddonation.enums.Role;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Data
@Getter
@Setter
public class AccountResponse {
    public String email;
    public String phone;
    public String fullName;
    public Gender gender;
    private LocalDateTime createAt;
    private Role role;
    private boolean enabled;
    public String token;
}





