package com.swp.blooddonation.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class SlotDTO
{
    long id;
    String label;
    LocalTime startTime;
    LocalTime endTime;
}
