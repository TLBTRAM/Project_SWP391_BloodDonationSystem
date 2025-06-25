package com.swp.blooddonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long id;

    String reason;

    String description;

    LocalDateTime createdAt;


    @ManyToOne
    @JoinColumn(name = "acount_id")
    @JsonIgnore
    Account account;

    @ManyToOne
    @JoinColumn(name = "appointment_id")
    Appointment appointment;

}