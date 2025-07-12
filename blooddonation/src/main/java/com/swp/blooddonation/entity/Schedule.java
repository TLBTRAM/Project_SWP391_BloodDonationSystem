package com.swp.blooddonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.swp.blooddonation.enums.ScheduleStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long id;

    private LocalDate scheduleDate;
//    private LocalTime startTime;
//    private LocalTime endTime;
//    private String location;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "schedule")
    @JsonIgnore
    private List<Register> registers;

    @Enumerated(EnumType.STRING)
    private ScheduleStatus status;


//    @OneToMany(mappedBy = "schedule")
//    private List<Slot> slots;
}

