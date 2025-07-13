package com.swp.blooddonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.Gender;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.enums.RhType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import jakarta.validation.constraints.Pattern;

@Entity
@Getter
@Setter
public class User {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private Account account;

    // Personal Info (chuyển từ Account)
    public String fullName;
    
    @Pattern(regexp = "^(0|\\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$", message = "Phone invalid!")
    public String phone;
    
    @Temporal(TemporalType.DATE)
    @Column(name = "birth_date")
    public Date birthDate;
    
    @Enumerated(EnumType.STRING)
    public Gender gender;

    // Address Info (chuyển từ Account)
    @ManyToOne
    @JoinColumn(name = "province_id")
    private Province province;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;

    @ManyToOne
    @JoinColumn(name = "ward_id")
    private Ward ward;

    @Column(name = "street")
    private String street;

    // Thuộc tính từ Customer
    @Enumerated(EnumType.STRING)
    private BloodType bloodType;

    @Enumerated(EnumType.STRING)
    private RhType rhType;


    private LocalDate lastDonationDate;

    // Thuộc tính từ MedicalStaff
    private String department;

    // Thuộc tính từ Manager
    private String note;

    @OneToMany(mappedBy = "user")
    private List<Blog> blogs;

    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    private List<Appointment> customerAppointments;

    @OneToMany(mappedBy = "user")
    List<Feedback> feedbacks;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    List<AccountSlot> accountSlots;

    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    List<Appointment> donorAppointments;

    @OneToMany(mappedBy = "medicalStaff")
    @JsonIgnore
    List<Appointment> staffAppointments;

} 