package com.swp.blooddonation.dto.request;

import com.swp.blooddonation.enums.NotificationType;
import lombok.*;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class NotificationRequest {
    public List<Long> receiverIds;
    public String title;
    public String content;
    public NotificationType type;
}
