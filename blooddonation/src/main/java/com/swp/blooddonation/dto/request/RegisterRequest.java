package com.swp.blooddonation.dto.request;

import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data

public class RegisterRequest {
    private LocalDate date; // Ngày đăng ký hiến máu
    private Long slotId;      // ID của slot (khung giờ)
    private String note;      // Ghi chú từ người đăng ký (nếu có)
}