package com.swp.blooddonation.dto.request;


import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class BloodComponentVolumeRequest {
    private int redCellVolume;
    private int plasmaVolume;
    private int plateletVolume;
}
