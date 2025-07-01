package com.swp.blooddonation.dto.request;

import lombok.Data;

@Data
public class FeedbackRequest {
    long appointmentId;
    String reason;
    String description;
}
