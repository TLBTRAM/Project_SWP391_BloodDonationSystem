package com.swp.blooddonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.swp.blooddonation.enums.RegisterStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;



import java.time.LocalDate;
import java.time.LocalDateTime;


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
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "schedule_id")
    private Schedule schedule;

//    @OneToMany(mappedBy = "register")
//    private List<TestResult> testResults;

    @ManyToOne
    @JoinColumn(name = "slot_id")
    private Slot slot;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "rejected_by_id")
    private User rejectedBy;

    private String rejectionReason;

    @Column(name = "canceled_at")
    private LocalDateTime canceledAt;

    @Column(name = "cancel_reason")
    private String cancelReason;


}
