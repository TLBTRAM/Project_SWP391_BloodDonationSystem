package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.Register;
import com.swp.blooddonation.entity.Slot;
import com.swp.blooddonation.entity.User;
import com.swp.blooddonation.enums.RegisterStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public interface RegisterRepository extends JpaRepository<Register, Long> {



    boolean existsByUserAndSlotAndRegisterDate(User user, Slot slot, LocalDate registerDate);

    List<Register> findBySlotAndRegisterDateAndStatusOrderByCreatedAt(
            Slot slot,
            LocalDate registerDate,
            RegisterStatus status
    );

    List<Register> findBySlotAndRegisterDateOrderByCreatedAt(Slot slot, LocalDate registerDate);

    List<Register> findByStatus(RegisterStatus status);

    List<Register> findByUser(User user);

    List<Register> findByUserAndStatus(User user, com.swp.blooddonation.enums.RegisterStatus status);
}