package com.swp.blooddonation.repository;


import com.swp.blooddonation.entity.BloodRequestComponent;
import com.swp.blooddonation.enums.ComponentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodRequestComponentRepository extends JpaRepository<BloodRequestComponent, Long> {

}

