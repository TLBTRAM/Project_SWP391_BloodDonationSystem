package com.swp.blooddonation.dto.request;

import com.swp.blooddonation.enums.ComponentType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ComponentRequestDTO {
    @NotNull
    private ComponentType componentType;

    @Min(1)
    private int quantity;
}

