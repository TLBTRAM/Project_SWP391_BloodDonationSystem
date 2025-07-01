package com.swp.blooddonation.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CustomerDTO {
    private Long id;
    private String fullName;
    private String bloodType;
    private LocalDate lastDonationDate;
    private String address;
    private String phone;
    private String email;
}
