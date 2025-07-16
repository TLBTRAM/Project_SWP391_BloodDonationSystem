package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Appointment;
import com.swp.blooddonation.entity.BloodTest;
import com.swp.blooddonation.entity.Register;
import com.swp.blooddonation.enums.BloodTestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BloodTestRepository extends JpaRepository<BloodTest, Long> {
    Optional<BloodTest> findByRegister(Register register);
    java.util.List<BloodTest> findAllByStatus(BloodTestStatus status);
}
