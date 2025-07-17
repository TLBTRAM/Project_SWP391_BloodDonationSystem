package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.BloodUnit;
import com.swp.blooddonation.entity.WholeBloodRequest;
import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.BloodUnitStatus;
import com.swp.blooddonation.enums.RhType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodUnitRepository extends JpaRepository<BloodUnit, Long> {

        @Query("SELECT u FROM BloodUnit u WHERE u.bloodType = :bloodType AND u.rhType = :rhType " +
                "AND u.status = com.swp.blooddonation.enums.BloodUnitStatus.COLLECTED " +
                "AND u.expirationDate >= CURRENT_DATE")
        List<BloodUnit> findUsableBloodUnits(@Param("bloodType") BloodType bloodType,
                                             @Param("rhType") RhType rhType);
        List<BloodUnit> findByWholeBloodRequest(WholeBloodRequest request);
        List<BloodUnit> findByStatus(BloodUnitStatus status);


        @Query("SELECT SUM(u.totalVolume) FROM BloodUnit u WHERE u.status = com.swp.blooddonation.enums.BloodUnitStatus.COLLECTED AND u.expirationDate >= CURRENT_DATE")
        Integer getTotalUsableVolume();

    @Query("SELECT SUM(bu.totalVolume) FROM BloodUnit bu")
    Long sumUnits();

    long countByDonorId(Long donorId);

    @Query("SELECT SUM(bu.totalVolume) FROM BloodUnit bu WHERE bu.donor.id = :userId")
    Long sumUnitsByUserId(@Param("userId") Long userId);
}