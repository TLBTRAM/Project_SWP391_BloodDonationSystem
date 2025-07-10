package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.BloodRequestComponent;
import com.swp.blooddonation.entity.PendingPatientRequest;
import com.swp.blooddonation.entity.WholeBloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PendingPatientRequestRepository extends JpaRepository<PendingPatientRequest, Long> {
    Optional<PendingPatientRequest> findByWholeBloodRequest(WholeBloodRequest wholeBloodRequest);
    Optional<PendingPatientRequest> findByBloodRequestComponent(BloodRequestComponent request);

}

