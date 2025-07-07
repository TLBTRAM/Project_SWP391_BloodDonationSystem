package com.swp.blooddonation.api;


import com.swp.blooddonation.dto.request.NotificationRequest;
import com.swp.blooddonation.dto.response.NotificationDTO;
import com.swp.blooddonation.service.NotificationService;
import com.swp.blooddonation.repository.AccountRepository;
import com.swp.blooddonation.entity.Account;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationAPI {

    private final NotificationService notificationService;
    private final AccountRepository accountRepository;

    @GetMapping("/{userId}")
    public List<NotificationDTO> getUserNotifications(@PathVariable Long userId) {
        return notificationService.getUserNotifications(userId);
    }

    @PostMapping("/send")
    public void sendNotification(@RequestBody NotificationRequest request) {
        notificationService.sendNotification(request);
    }

    @PostMapping("/send-system")
    public void sendSystemNotification(@RequestBody NotificationRequest request) {
        // Lấy tất cả userId
        java.util.List<Long> allUserIds = accountRepository.findAll().stream().map(Account::getId).toList();
        NotificationRequest systemRequest = NotificationRequest.builder()
            .receiverIds(allUserIds)
            .title(request.getTitle())
            .content(request.getContent())
            .type(request.getType())
            .build();
        notificationService.sendNotification(systemRequest);
    }

    @PatchMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
    }
}

