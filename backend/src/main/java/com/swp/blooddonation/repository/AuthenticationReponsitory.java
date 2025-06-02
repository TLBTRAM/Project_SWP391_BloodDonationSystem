package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthenticationReponsitory extends JpaRepository<User, Long> {
    // long là kiểu dữ liệu khóa chính của account
    User findUserByEmail(String email);
    boolean existsByEmail(String email);
}
