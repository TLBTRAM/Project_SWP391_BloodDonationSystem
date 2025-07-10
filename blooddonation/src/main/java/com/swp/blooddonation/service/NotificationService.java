package com.swp.blooddonation.service;


import com.swp.blooddonation.dto.request.NotificationRequest;
import com.swp.blooddonation.dto.response.NotificationDTO;
import com.swp.blooddonation.entity.Notification;
import com.swp.blooddonation.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    @Autowired
    private com.swp.blooddonation.repository.AccountRepository accountRepository;


    public void sendNotification(NotificationRequest request) {
        List<Notification> notifications = request.getReceiverIds().stream().map(id -> Notification.builder()
                .receiverId(id)
                .title(request.getTitle())
                .content(request.getContent())
                .type(request.getType())
                .isRead(false)
                .build()
        ).toList();

        notificationRepository.saveAll(notifications);
    }
    public List<NotificationDTO> getUserNotifications(Long userId) {
        return notificationRepository.findByReceiverIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    public boolean isOwner(Long notificationId, Long accountId) {
        return notificationRepository.findById(notificationId)
                .map(notification -> notification.getReceiverId().equals(accountId))
                .orElse(false);
    }

    public long countAll() {
        return notificationRepository.count();
    }
    public long countByUserId(Long userId) {
        return notificationRepository.countByReceiverId(userId);
    }

    private NotificationDTO toDTO(Notification n) {
        return NotificationDTO.builder()
                .id(n.getId())
                .title(n.getTitle())
                .content(n.getContent())
                .type(n.getType())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }

}
