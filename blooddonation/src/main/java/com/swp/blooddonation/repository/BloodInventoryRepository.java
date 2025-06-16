package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.BloodInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BloodInventoryRepository extends JpaRepository<BloodInventory, String> {
    // String là kiểu của khóa chính (bloodType)
}
