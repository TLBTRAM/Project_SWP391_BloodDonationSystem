package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Sample;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SampleRepository extends JpaRepository<Sample, Long> {
}

