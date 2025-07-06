package com.swp.blooddonation.dto.request;

import com.swp.blooddonation.enums.NotificationType;
import lombok.Data;

import java.util.List;

@Data
public class NotificationRequest {
    private List<Long> receiverIds;
    private String title;
    private String content;
    private NotificationType type;
}
