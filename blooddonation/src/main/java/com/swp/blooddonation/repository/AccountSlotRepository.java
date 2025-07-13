package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.AccountSlot;
import com.swp.blooddonation.entity.Slot;
import com.swp.blooddonation.entity.User;
import com.swp.blooddonation.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AccountSlotRepository extends JpaRepository<AccountSlot, Long> {

    long countBySlot_IdAndDateAndUser_Account_Role(long slotId, LocalDate date, Role role);

    List<AccountSlot> findByDateAndUser_Account_Role(LocalDate date, Role role);


    boolean existsByUserAndDate(User user, LocalDate date);


    List<AccountSlot> findBySlotAndDateAndUser_Account_Role(Slot slot, LocalDate date, Role role);

}
