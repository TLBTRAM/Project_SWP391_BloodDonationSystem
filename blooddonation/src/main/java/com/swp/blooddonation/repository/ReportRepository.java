package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
}
