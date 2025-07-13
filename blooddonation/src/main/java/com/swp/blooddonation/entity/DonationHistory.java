package com.swp.blooddonation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class DonationHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime donationDate;
    private int volume; // đơn vị ml

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer;

    private String location;
    private String notes;
}
