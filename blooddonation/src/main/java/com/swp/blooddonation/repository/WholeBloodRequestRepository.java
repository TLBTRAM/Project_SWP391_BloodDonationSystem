package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.WholeBloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WholeBloodRequestRepository extends JpaRepository<WholeBloodRequest, Long> {
}
