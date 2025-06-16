package com.swp.blooddonation.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {
//    @NotBlank(message = "Email is required")
//    @Email(message = "Invalid email format")
    public String email;

//    @NotBlank(message = "Code is required")
    public String code;

//    @NotBlank(message = "New password is required")
    public String newPassword;
}


