package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {
    // Không cần thêm gì nếu Donor liên kết 1-1 với Account thông qua @MapsId
    // Nếu cần thêm custom query, có thể thêm tại đây
}
