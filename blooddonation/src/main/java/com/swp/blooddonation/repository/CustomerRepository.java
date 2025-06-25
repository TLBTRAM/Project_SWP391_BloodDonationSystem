package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}