package com.swp.blooddonation.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.swp.blooddonation.enums.BloodRequestStatus;
import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.ComponentType;
import com.swp.blooddonation.enums.RhType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class BloodRequestComponent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonIgnore
    private User requester;

    @ManyToOne
    @JsonIgnore
    private Patient patient;

    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    @Enumerated(EnumType.STRING)
    private RhType rhType;

    private String hospitalName;
    private String medicalCondition;

    private LocalDateTime requestDate;

    @Enumerated(EnumType.STRING)
    private BloodRequestStatus status;

//    @Enumerated(EnumType.STRING)
//    private ComponentType componentType;

    //các thành phần máu
    private int redCellQuantity;     // Hồng cầu
    private int plasmaQuantity;      // Huyết tương
    private int plateletQuantity;    // Tiểu cầu
}

