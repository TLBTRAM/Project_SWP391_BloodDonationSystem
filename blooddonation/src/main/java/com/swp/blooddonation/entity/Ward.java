package com.swp.blooddonation.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="ward")
public class Ward {
    @Id
    private Long id;
    private String name;
    @ManyToOne
    @JoinColumn(name="district_id")
    private District district;
}