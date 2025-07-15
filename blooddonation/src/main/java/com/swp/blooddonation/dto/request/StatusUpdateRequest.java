package com.swp.blooddonation.dto.request;

import com.swp.blooddonation.enums.RegisterStatus;
import lombok.Data;

@Data
public class StatusUpdateRequest {
    private RegisterStatus status;
    private String reason;
} 