package com.swp.blooddonation.api;


import com.swp.blooddonation.dto.request.NotificationRequest;
import com.swp.blooddonation.dto.response.NotificationDTO;
import com.swp.blooddonation.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationAPI {

    private final NotificationService notificationService;

    @GetMapping("/{userId}")
    public List<NotificationDTO> getUserNotifications(@PathVariable Long userId) {
        return notificationService.getUserNotifications(userId);
    }

    @PostMapping("/send")
    public void sendNotification(@RequestBody NotificationRequest request) {
        notificationService.sendNotification(request);
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

