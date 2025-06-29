package com.swp.blooddonation.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Data
@Getter
@Setter
public class RegisterSlotDTO {
    LocalDate date;
    
}
