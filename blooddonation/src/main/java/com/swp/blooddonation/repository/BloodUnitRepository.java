package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.BloodUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodUnitRepository extends JpaRepository<BloodUnit, Long> {
    List<BloodUnit> findByBloodTypeAndStatus(String bloodType, String status);
    boolean existsByUnitCode(String unitCode);
}