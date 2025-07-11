package com.swp.blooddonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;



@Entity
@Getter
@Setter
@Table(name="district")
public class District {
    @Id
    private Long id;
    private String name;
    @ManyToOne
    @JoinColumn(name="province_id")
    @JsonIgnore
    private Province province;
    @OneToMany(mappedBy="district")
    @JsonIgnore
    private List<Ward> wards;
}