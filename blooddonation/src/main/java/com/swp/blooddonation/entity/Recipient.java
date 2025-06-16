package com.swp.blooddonation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class Recipient {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private Account account;
    private String bloodTypeNeeded;
    private String hospitalName;
    private String medicalCondition;
}
