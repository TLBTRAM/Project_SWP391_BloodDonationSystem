package com.swp.blooddonation.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class DonationHistoryDTO {
    private Long id;
    private LocalDate donationDate;
    private int volume; // ml
    private String location;
    private String note;
}
