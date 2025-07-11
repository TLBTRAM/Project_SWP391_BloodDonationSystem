package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);
    long countByReceiverId(Long receiverId);
}
