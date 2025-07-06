package com.swp.blooddonation.dto.response;

import com.swp.blooddonation.enums.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationDTO {
    private Long id;
    private String title;
    private String content;
    private NotificationType type;
    private boolean isRead;
    private LocalDateTime createdAt;
}
