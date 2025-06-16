package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.BloodSample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BloodSampleRepository extends JpaRepository<BloodSample, Long> {
    boolean existsBySampleCode(String sampleCode);
}
