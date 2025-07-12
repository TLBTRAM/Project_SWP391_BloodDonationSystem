package com.swp.blooddonation.entity;

import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.Gender;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.enums.RhType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;
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
    private LocalDate lastDonationDate;

    // Thuộc tính từ MedicalStaff
    private String department;

    // Thuộc tính từ Manager
    private String note;
} 