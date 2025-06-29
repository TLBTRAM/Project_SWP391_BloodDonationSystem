package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.AccountSlot;
import com.swp.blooddonation.entity.Slot;
import com.swp.blooddonation.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AccountSlotRepository extends JpaRepository<AccountSlot, Long> {
    List<AccountSlot> findAccountsSlotsByAccountAndDate(Account account, LocalDate date);

    AccountSlot findAccountSlotBySlotIdAndAccountAndDate(long slotId, Account account, LocalDate date);
    long countBySlot_IdAndDateAndAccount_Role(long slotId, LocalDate date, Role role);
    List<AccountSlot> findByDateAndAccount_Role(LocalDate date, Role role);

    List<AccountSlot> findAccountSlotsByAccountAndDate(Account account, LocalDate date);

    List<AccountSlot> findBySlot_IdAndDateAndAccount_Role(Long slotId, LocalDate date, Role role);
    List<AccountSlot> findByDate(LocalDate date);

    boolean existsByAccountAndDate(Account account, LocalDate date);

    List<AccountSlot> findBySlotAndDateAndAccount_Role(Slot slot, LocalDate date, Role role);
}
