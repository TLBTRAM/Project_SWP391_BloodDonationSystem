package com.swp.blooddonation.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DonationHistoryDTO {
    private Long id;
    private String donorName;
    private LocalDateTime donationDate;
    private int volume; // ml
//    private String location;
    private String notes;
}
