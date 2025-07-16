package com.swp.blooddonation.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BloodUnitSimpleResponse {
    private Long id;
    private String bloodType;
    private LocalDate collectedDate;
    private LocalDate expirationDate;
    private String rhType;
    private Integer totalVolume;
    private Long collectedById;
    private Long donorId;
} 