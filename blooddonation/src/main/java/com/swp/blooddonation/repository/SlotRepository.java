package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Slot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalTime;

public interface SlotRepository extends JpaRepository<Slot,Long>
{
    boolean existsByStartTimeAndEndTime(LocalTime startTime, LocalTime endTime);

}