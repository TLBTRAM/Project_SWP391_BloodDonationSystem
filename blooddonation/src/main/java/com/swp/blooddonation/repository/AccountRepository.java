package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Account;
//import com.swp.blooddonation.entity.Customer;
import com.swp.blooddonation.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    // Tìm tài khoản theo email (dùng trong đăng nhập)
    Optional<Account> findAccountByEmail(String email);

    // Kiểm tra email đã tồn tại chưa
    boolean existsByEmail(String email);



    // Tìm tài khoản theo vai trò
    List<Account> findByRole(Role role);

    Account findByEmail(String email);
    Optional<Account> findById(Long id);
}