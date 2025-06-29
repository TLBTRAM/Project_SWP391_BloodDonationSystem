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
    private Account customer; // Người hiến máu

    @ManyToOne
    @JoinColumn(name = "medical_staff_id")
    private Account medicalStaff; // Gán khi phê duyệt

    @ManyToOne
    @JoinColumn(name = "slot_id")
    private Slot slot; // Khung giờ hiến máu

//    @ManyToOne
//    @JoinColumn(name = "account_id")
//    Account account;


    @OneToMany(mappedBy = "appointment")
    List<Feedback> feedbacks;

    @OneToOne
    @JoinColumn(name = "register_id")
    private Register register;

    // chỉ có 1 dịch vụ hiến máu nên không cần dùng
//    @ManyToMany(cascade = CascadeType.ALL)
//    @JoinTable(
//            name="appointment_services",
//            joinColumns = @JoinColumn(name="appointment_id"),
//            inverseJoinColumns = @JoinColumn(name="service_id")
//    )
//    private List<MedicineService> medicineServices;

    // Nếu muốn dùng chung cho cả nhận máu, thêm:
    // private String type; // "DONATION" hoặc "REQUEST"
}

