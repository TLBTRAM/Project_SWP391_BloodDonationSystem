package com.swp.blooddonation.dto.response;

import com.swp.blooddonation.enums.AppointmentEnum;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class AppointmentResponse {
    private Long id;
    private LocalDate createAt;
    private LocalDate appointmentDate;
    private AppointmentEnum status;
    
    // Donor info
    private String donorName;
    private String donorEmail;
    private String donorPhone;
    private String donorBloodType;
    
    // Medical staff info
    private String medicalStaffName;
    private String medicalStaffEmail;
    private String medicalStaffPhone;
    
    // Slot info
    private String slotLabel;
    private LocalTime slotStart;
    private LocalTime slotEnd;
    
    // Services
    private List<String> serviceNames;
} 