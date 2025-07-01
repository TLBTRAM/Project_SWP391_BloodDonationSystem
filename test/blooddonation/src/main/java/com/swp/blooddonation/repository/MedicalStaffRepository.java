package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.MedicalStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalStaffRepository extends JpaRepository<MedicalStaff, Long> {
    // Optional custom methods (if needed)
    MedicalStaff findByAccount_Email(String email);
    boolean existsByAccount_Id(Long accountId);
}
