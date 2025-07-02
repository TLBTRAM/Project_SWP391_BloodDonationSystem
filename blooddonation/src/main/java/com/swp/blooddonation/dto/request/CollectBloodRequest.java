package com.swp.blooddonation.dto.request;

import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.RhType;
import lombok.Data;

@Data
public class CollectBloodRequest {
    private Long testId;
    private BloodType bloodType;
    private RhType rhType;
    private int totalVolume;
}
