package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.Register;
import com.swp.blooddonation.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;

public interface RegisterRepository extends JpaRepository<Register, Long> {
//    boolean existsByAccountAndSlotAndTime(Account account, Slot slot, LocalTime time);
    boolean existsByAccountAndSlot_IdAndRegisterDate(Account account, Long slotId, LocalDate registerDate);


}