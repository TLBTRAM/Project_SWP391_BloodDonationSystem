package com.swp.blooddonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;
import java.util.List;

@Entity
@Getter
@Setter
public class Slot
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;

    String label;
    LocalTime start;
    LocalTime end;
    boolean isDelete =false;

    @OneToMany(mappedBy = "slot")
    @JsonIgnore
    List<AccountSlot> accountSlots;
}


