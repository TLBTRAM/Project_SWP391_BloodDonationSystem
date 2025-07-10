package com.swp.blooddonation.dto.response;

import com.swp.blooddonation.enums.ScheduleStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ScheduleResponseDTO {
    private Long id;
    private LocalDate scheduleDate;
    private ScheduleStatus status;
    private Long createdBy;
}

