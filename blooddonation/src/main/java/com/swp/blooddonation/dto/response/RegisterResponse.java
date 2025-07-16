package com.swp.blooddonation.dto.response;

import com.swp.blooddonation.entity.Slot;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponse {
    private Long id;
    private LocalDate registerDate;
    private String status;
    private String note;
    private Slot slot;
    private Long userId;
    private String fullName;
    private Boolean passed; // Thêm field này
}
