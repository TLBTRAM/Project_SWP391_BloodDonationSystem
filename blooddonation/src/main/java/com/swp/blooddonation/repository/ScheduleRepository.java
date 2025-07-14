package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.Schedule;
import com.swp.blooddonation.enums.ScheduleStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    Optional<Schedule> findByScheduleDate(LocalDate date);
    boolean existsByScheduleDate(LocalDate scheduleDate);
    boolean existsByScheduleDateAndStatus(LocalDate scheduleDate, ScheduleStatus status);

    // Lấy tất cả schedule theo tháng
    @org.springframework.data.jpa.repository.Query("SELECT s FROM Schedule s WHERE MONTH(s.scheduleDate) = :month AND YEAR(s.scheduleDate) = :year")
    java.util.List<Schedule> findByMonthAndYear(@org.springframework.data.repository.query.Param("month") int month, @org.springframework.data.repository.query.Param("year") int year);

    // Lấy tất cả schedule theo trạng thái
    java.util.List<Schedule> findByStatus(com.swp.blooddonation.enums.ScheduleStatus status);
}