package com.swp.blooddonation.dto.request;

import lombok.Data;

@Data
public class ReportRequest {
    long appointmentId;
    String reason;
    String description;
}