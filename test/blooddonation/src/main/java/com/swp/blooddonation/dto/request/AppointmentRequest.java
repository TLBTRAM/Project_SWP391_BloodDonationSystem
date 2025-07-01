package com.swp.blooddonation.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AppointmentRequest {
    private long slotId;
    private LocalDate appointmentDate;
//    private List<Long> serviceId;
}
