package com.swp.blooddonation.dto.request;

import com.swp.blooddonation.enums.BloodUnitStatus;
import lombok.Data;

@Data
public class UpdateBloodUnitStatusRequest {
    private BloodUnitStatus status;
} 