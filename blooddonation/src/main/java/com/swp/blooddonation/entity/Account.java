package com.swp.blooddonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.swp.blooddonation.enums.EnableStatus;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.enums.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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

    @NotBlank(message = "Password can not blank")
    @Size(min = 6, message = "Password must be at leat 6 characters!")
    @JsonIgnore
    private String password;

    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    public Role role;

    @Enumerated(EnumType.STRING)
    public EnableStatus enableStatus;


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

    public String getRoleName() {
        return role != null ? role.name() : null;
    }

//    @OneToMany(mappedBy = "account")
//    @JsonIgnore
//    List<AccountSlot> accountSlots;
//
//    @OneToMany(mappedBy = "customer")
//    @JsonIgnore
//    List<Appointment> donorAppointments;
//
//    @OneToMany(mappedBy = "medicalStaff")
//    @JsonIgnore
//    List<Appointment> staffAppointments;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    @JsonIgnore
    private User user;

//    // Người đi hiến máu (donor)
//    @OneToMany(mappedBy = "customer")
//    @JsonIgnore
//    private List<Appointment> customerAppointments;
//
//    @OneToMany(mappedBy = "account")
//    List<Feedback> feedbacks;

}