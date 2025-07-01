package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Customer;
import com.swp.blooddonation.entity.DonationHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationHistoryRepository extends JpaRepository<DonationHistory, Long> {
//    List<DonationHistory> findByCustomer(Customer donor);
    List<DonationHistory> findByCustomer(Customer customer);

}

