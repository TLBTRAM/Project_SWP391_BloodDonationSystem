package com.swp.blooddonation.dto;

import com.swp.blooddonation.enums.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateRoleRequest {
    private Long accountId;

    @NotBlank(message = "Vai trò mới không được để trống")
    private Role newRole;
}

