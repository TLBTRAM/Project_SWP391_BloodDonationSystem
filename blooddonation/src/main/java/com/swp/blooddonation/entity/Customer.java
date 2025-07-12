//package com.swp.blooddonation.entity;
//
//import com.swp.blooddonation.enums.BloodType;
//import com.swp.blooddonation.enums.RhType;
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//import java.time.LocalDate;
//
//@Entity
//@Getter
//@Setter
//public class Customer {
//    @Id
//    private Long id;
//
//    @OneToOne
//    @MapsId
//    @JoinColumn(name = "id")
//    private Account account;
//
//    // Từ Donor
//    @Enumerated(EnumType.STRING)
//    private BloodType bloodType;
//
//    @Enumerated(EnumType.STRING)
//    private RhType rhType;
//
//    private LocalDate lastDonationDate;
//
//    @Column(nullable = false)
//    private boolean active = true;
//}