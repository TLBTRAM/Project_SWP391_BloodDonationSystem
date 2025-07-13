package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.User;
import com.swp.blooddonation.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Methods từ CustomerRepository và MedicalStaffRepository
    Optional<User> findByAccount(Account account);
    Optional<User> findByAccount_Email(String email);
    boolean existsByAccount_Id(Long accountId);
    
    // Custom queries theo role (role được lưu trong Account)
    @Query("SELECT u FROM User u WHERE u.account.role = ?1")
    List<User> findByRole(Role role);
    
    // Custom queries theo role string
    @Query("SELECT u FROM User u WHERE u.account.role = ?1")
    List<User> findByRole(String role);
    
    // Convenience methods
    @Query("SELECT u FROM User u WHERE u.account.role = 'CUSTOMER'")
    List<User> findAllCustomers();
    
    @Query("SELECT u FROM User u WHERE u.account.role = 'MEDICALSTAFF'")
    List<User> findAllMedicalStaff();
    
    @Query("SELECT u FROM User u WHERE u.account.role = 'MANAGER'")
    List<User> findAllManagers();
} 