package com.swp.blooddonation.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class AppointmentRequest {
    private long slotId;
    private LocalDate appointmentDate;
//    private List<Long> serviceId;
}
