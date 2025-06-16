package com.swp.blooddonation.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class SampleRequestDTO {
    @NotNull
    private Long donorId;

    @NotNull
    private LocalDate sampleDate;

    private double totalVolume;         // Ví dụ: 450 ml
    private String storageLocation;     // Ví dụ: "Tủ lạnh A1"
    private String note;                // Ghi chú thêm
}
