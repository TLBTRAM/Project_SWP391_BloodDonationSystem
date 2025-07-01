package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.BloodUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BloodUnitRepository extends JpaRepository<BloodUnit, Long> {
}