package com.swp.blooddonation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TestResultRequestDTO {

    @NotBlank(message = "Blood type is required")
    private String bloodType; // Nhóm máu: A+, O-, B+, v.v.

    @NotNull
    private Boolean hivNegative;

    @NotNull
    private Boolean hbvNegative;

    @NotNull
    private Boolean hcvNegative;

    @NotNull
    private Boolean syphilisNegative;

    private String notes; // Ghi chú thêm nếu có (không bắt buộc)
}
