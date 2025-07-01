//package com.swp.blooddonation.entity;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//
//import java.util.List;
//
//@Getter
//@Setter
//@Entity
//public class MedicineService {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    public long id;
//
//    String name;
//    String description;
//    float price;
//    boolean isAvailable = true;
//
//    @ManyToMany
//    @JsonIgnore
//    List<Appointment> appointments;
//
//
//}
