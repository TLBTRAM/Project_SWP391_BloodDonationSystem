package com.swp.blooddonation.dto.response;

import com.swp.blooddonation.enums.ScheduleStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ScheduleResponseDTO {
    private Long scheduleId;
    private LocalDate scheduleDate;
//    private LocalTime startTime;
//    private LocalTime endTime;
    private ScheduleStatus status;

    private String createdBy; // tên hoặc email của người tạo lịch
}
