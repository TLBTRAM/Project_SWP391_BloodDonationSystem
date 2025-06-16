package com.swp.blooddonation.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class BloodInventory {
    @Id
    private String bloodType; // Ví dụ: A+, O-

    private int totalVolume; // Tổng thể tích (ml)
    private int totalUnits;  // Số túi máu

    private LocalDate lastUpdated;

    @ManyToOne
    @JoinColumn(name = "blood_type_id") // Bạn có thể đổi tên nếu muốn
    private BloodType type;
}

