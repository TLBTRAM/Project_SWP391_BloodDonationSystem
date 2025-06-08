package com.swp.blooddonation.dto;

import com.swp.blooddonation.enums.Gender;
import com.swp.blooddonation.enums.Role;
import lombok.Data;

@Data
public class AccountResponse {
    public String email;
    public String phone;
    public String fullName;
    public Gender gender;
    public Role role;
    public String token;
}
