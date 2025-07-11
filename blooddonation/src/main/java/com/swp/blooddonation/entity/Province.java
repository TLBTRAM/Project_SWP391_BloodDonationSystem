package com.swp.blooddonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@Table(name="province")
public class Province {
    @Id
    private Long id;
    private String name;
    @OneToMany(mappedBy="province")
    @JsonIgnore
    private List<District> districts;
}
