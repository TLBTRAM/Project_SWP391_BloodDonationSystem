package com.swp.blooddonation.entity;

import com.swp.blooddonation.enums.AppointmentEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime createdAt;

    private LocalDate appointmentDate;

    @Enumerated(EnumType.STRING)
    private AppointmentEnum status;



    @ManyToOne
    @JoinColumn(name = "customer_id")
    private User customer; // Người hiến máu

    @ManyToOne
    @JoinColumn(name = "medical_staff_id")
    private User medicalStaff; // Gán khi phê duyệt

    @ManyToOne
    @JoinColumn(name = "slot_id")
    private Slot slot; // Khung giờ hiến máu

    @OneToMany(mappedBy = "appointment")
    List<Feedback> feedbacks;

    @OneToOne
    @JoinColumn(name = "register_id")
    private Register register;

}

