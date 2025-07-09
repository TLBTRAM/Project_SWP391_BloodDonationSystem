package com.swp.blooddonation.api;


import com.swp.blooddonation.dto.request.NotificationRequest;
import com.swp.blooddonation.dto.response.NotificationDTO;
import com.swp.blooddonation.service.NotificationService;
import com.swp.blooddonation.repository.AccountRepository;
import com.swp.blooddonation.entity.Account;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor
public class NotificationAPI {

    private final NotificationService notificationService;
    private final AccountRepository accountRepository;

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or #userId == authentication.principal.id")
    public List<NotificationDTO> getUserNotifications(@PathVariable Long userId) {
        return notificationService.getUserNotifications(userId);
    }

    @PostMapping("/send")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEDICALSTAFF')")
    public void sendNotification(@RequestBody NotificationRequest request) {
        notificationService.sendNotification(request);
    }

    @PostMapping("/send-system")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
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
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or @notificationService.isOwner(#id, authentication.principal.id)")
    public void markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or @notificationService.isOwner(#id, authentication.principal.id)")
    public void deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
    }
}

