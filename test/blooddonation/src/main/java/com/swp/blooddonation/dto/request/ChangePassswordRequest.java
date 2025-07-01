package com.swp.blooddonation.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePassswordRequest {
//    @NotBlank(message = "Email can not blank")
//    @Email(message = "Invalid email format")
    private String email;
//
//    @NotBlank(message = "Password can not blank")
    private String password;

//    @NotBlank(message = "New password is required")
    private String newPassword;

}
