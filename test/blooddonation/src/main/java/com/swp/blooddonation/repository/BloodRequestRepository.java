package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.BloodRequest;
import com.swp.blooddonation.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    List<BloodRequest> findByCustomer(Customer customer);
}
