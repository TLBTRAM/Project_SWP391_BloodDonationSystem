//package com.swp.blooddonation.entity;
//
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//
//@Entity
//@Getter
//@Setter
//public class Manager {
//    @Id
//    private Long id;
//
//    @OneToOne
//    @MapsId
//    @JoinColumn(name = "id")
//    private Account account;
//    private String note;
//
//    @Column(nullable = false)
//    private boolean active = true;
//}
