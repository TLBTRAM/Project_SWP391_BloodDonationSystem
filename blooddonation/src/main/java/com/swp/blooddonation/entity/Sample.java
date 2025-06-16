package com.swp.blooddonation.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class Sample {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate sampleDate;
    private double totalVolume;
    private String storageLocation;
    private String note;

    @ManyToOne
    @JoinColumn(name = "donor_id")
    private Donor donor;
}
