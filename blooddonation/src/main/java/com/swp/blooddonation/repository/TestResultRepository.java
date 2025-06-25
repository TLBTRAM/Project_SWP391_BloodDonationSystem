package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.MedicalStaff;
import com.swp.blooddonation.entity.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByStaff(MedicalStaff staff);
}
