package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.BloodComponent;
import com.swp.blooddonation.entity.BloodRequestComponent;
import com.swp.blooddonation.entity.User;
import com.swp.blooddonation.enums.BloodRequestStatus;
import com.swp.blooddonation.enums.ComponentStatus;
import com.swp.blooddonation.enums.ComponentType;
import com.swp.blooddonation.enums.BloodType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BloodComponentRepository extends JpaRepository<BloodComponent, Long> {

    // Tìm các thành phần còn sử dụng được
    List<BloodComponent> findByStatus(ComponentStatus status);

    // Tìm các thành phần máu theo loại máu + trạng thái
    List<BloodComponent> findByBloodTypeAndComponentTypeAndStatus(
            BloodType bloodType,
            ComponentType componentType,
            ComponentStatus status
    );

    // Tìm các thành phần đã hết hạn
    List<BloodComponent> findByStatusAndExpirationDateBefore(
            ComponentStatus status,
            LocalDate date
    );

    // Kiểm kê tồn kho theo nhóm máu và thành phần
    long countByBloodTypeAndComponentTypeAndStatus(
            BloodType bloodType,
            ComponentType componentType,
            ComponentStatus status
    );
    List<BloodComponent> findByBloodRequestComponent(BloodRequestComponent requestComponent);
}
