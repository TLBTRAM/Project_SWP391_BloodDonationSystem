package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.AccountSchedule;
import com.swp.blooddonation.entity.User;
import com.swp.blooddonation.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;

public interface AccountScheduleRepository extends JpaRepository<AccountSchedule, Long> {
    boolean existsByUserAndSchedule(User user, Schedule schedule);
    boolean existsByUserAndSchedule_ScheduleDate(User user, LocalDate scheduleDate);
} 