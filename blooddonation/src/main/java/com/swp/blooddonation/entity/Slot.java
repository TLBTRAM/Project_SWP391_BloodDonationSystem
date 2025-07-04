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
    @Column(name = "start_time")
    LocalTime startTime;
    @Column(name = "end_time")
    LocalTime endTime;
    boolean isDelete =false;

    @OneToMany(mappedBy = "slot")
    @JsonIgnore
    List<AccountSlot> accountSlots;

//    @ManyToOne
//    @JoinColumn(name = "schedule_id")
//    private Schedule schedule;


}


