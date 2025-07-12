package com.swp.blooddonation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
public class AccountSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long id;
    LocalDate date;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name ="slot_id")
    Slot slot;

    boolean isAvailable = true;

}
