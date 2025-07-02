package com.swp.blooddonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.swp.blooddonation.enums.EnableStatus;
import com.swp.blooddonation.enums.Gender;
import com.swp.blooddonation.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Account implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Email(message = "Email not valid!")
    public String email;

    @Pattern(regexp = "^(0|\\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-9])[0-9]{7}$", message = "Phone invalid!")
    public String phone;

    @NotBlank(message = "Password can not blank")
    @Size(min = 6, message = "Password must be at leat 6 characters!")
    @JsonIgnore
    private String password;

    @JsonProperty("fullname")
    @Column(name = "fullname")
    public String fullName;

    @Temporal(TemporalType.DATE)
    @Column(name = "birth_date")
    private Date birthDate;

    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    public Gender gender;

    @Enumerated(EnumType.STRING)
    public Role role;

    @Enumerated(EnumType.STRING)
    public EnableStatus enableStatus;

    private String address;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.enableStatus == EnableStatus.ENABLE;
    }

    @OneToMany(mappedBy = "account")
    @JsonIgnore
    List<AccountSlot> accountSlots;

    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    List<Appointment> donorAppointments;

    @OneToMany(mappedBy = "medicalStaff")
    @JsonIgnore
    List<Appointment> staffAppointments;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    @JsonIgnore
    private Customer customer;

    // Người đi hiến máu (donor)
    @OneToMany(mappedBy = "customer")
    @JsonIgnore
    private List<Appointment> customerAppointments;

    @OneToMany(mappedBy = "account")
    List<Feedback> feedbacks;

    @OneToMany(mappedBy = "account")
    List<Blog> blogs;
}