package com.swp.blooddonation.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @NotBlank(message = "Email can not blank")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password can not blank")
    private String password;

//    @NotBlank(message = "New password can not blank")
//    private String newPassword;
}