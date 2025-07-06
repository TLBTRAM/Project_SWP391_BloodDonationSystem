package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Customer;
import com.swp.blooddonation.entity.WholeBloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodRequestRepository extends JpaRepository<WholeBloodRequest, Long> {
}
