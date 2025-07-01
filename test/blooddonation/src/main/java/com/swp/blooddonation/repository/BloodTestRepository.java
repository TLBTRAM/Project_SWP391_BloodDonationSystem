package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Appointment;
import com.swp.blooddonation.entity.BloodTest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BloodTestRepository extends JpaRepository<BloodTest, Long> {
    Optional<BloodTest> findByAppointment(Appointment appointment);
}
