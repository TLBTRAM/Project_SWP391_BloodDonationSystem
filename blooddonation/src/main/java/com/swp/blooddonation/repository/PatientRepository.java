package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    // Tìm bệnh nhân theo tên + ngày sinh (dùng để kiểm tra trùng)
    Optional<Patient> findByFullNameAndDateOfBirth(String fullName, LocalDate dateOfBirth);
}
