package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.User;
import com.swp.blooddonation.entity.DonationHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationHistoryRepository extends JpaRepository<DonationHistory, Long> {
    List<DonationHistory> findByCustomer(User customer);
    List<DonationHistory> findByCustomerOrderByDonationDateDesc(User customer);
}

