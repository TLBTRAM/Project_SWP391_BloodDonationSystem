package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthenticationReponsitory extends JpaRepository<Account, Long> {
    // long là kiểu dữ liệu khóa chính của account
    Account findAccountByEmail(String email);
    boolean existsByEmail(String email);
}
