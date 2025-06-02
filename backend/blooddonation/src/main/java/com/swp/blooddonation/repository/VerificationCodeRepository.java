package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.VerificationCode;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    // Lấy mã xác minh mới nhất (latest) theo thời gian hết hạn
    Optional<VerificationCode> findTopByEmailOrderByExpiresAtDesc(String email);

    @Modifying
    @Transactional
    @Query("delete from VerificationCode v where v.email = ?1")
    void deleteByEmail(String email);

    // dùng optional vì có thể xảy ra null
}
