package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Recipient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipientRepository extends JpaRepository<Recipient, Long> {

    // ❓ Tìm recipient theo email của account
    Recipient findByAccount_Email(String email);

    // ❓ Kiểm tra recipient có tồn tại theo account ID
    boolean existsByAccount_Id(Long accountId);
}