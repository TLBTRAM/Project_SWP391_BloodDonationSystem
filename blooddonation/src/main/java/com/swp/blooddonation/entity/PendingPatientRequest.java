package com.swp.blooddonation.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.swp.blooddonation.enums.Gender;
import com.swp.blooddonation.enums.BloodRequestStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingPatientRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private LocalDate dateOfBirth;

    private String phone;

    private String street;
    private Long wardId;
    private Long districtId;
    private Long provinceId;


    private String bloodType;

    private String email;


    @Enumerated(EnumType.STRING)
    private BloodRequestStatus status; // PENDING, APPROVED, REJECTED

    @ManyToOne
    @JoinColumn(name = "whole_blood_request_id")
    private WholeBloodRequest wholeBloodRequest;

    @OneToOne
    @JoinColumn(name = "register_id")
    private Register register;


    private LocalDateTime createdAt;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "blood_request_component_id")
    private BloodRequestComponent bloodRequestComponent;


}
