package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface AuthenticationReponsitory extends JpaRepository<Account, Long> {
    // long là kiểu dữ liệu khóa chính của account
    Account findAccountByEmail(String email);
    boolean existsByEmail(String email);
    List<Account> findByRole(Role role);
}
