package com.swp.blooddonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.swp.blooddonation.enums.RegisterStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.apache.catalina.User;


import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
public class Register {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate registerDate;

//    private LocalDateTime time;

    @Enumerated(EnumType.STRING)
    private RegisterStatus status; //    PENDING, APPROVED, CANCELED

    private String note;

    @ManyToOne
    @JoinColumn(name = "account_id")
    @JsonIgnore
    private Account account;

    @ManyToOne
    private Schedule schedule;

//    @OneToMany(mappedBy = "register")
//    private List<TestResult> testResults;

    @ManyToOne
    @JoinColumn(name = "slot_id")
    private Slot slot;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "rejected_by_id")
    private Account rejectedBy;

    private String rejectionReason;



}
