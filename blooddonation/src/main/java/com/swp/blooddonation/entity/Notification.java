package com.swp.blooddonation.entity;

import com.swp.blooddonation.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Setter
@Getter
public class Notification {
    @Id @GeneratedValue
    private Long id;

    private Long receiverId; // ID người nhận
    private String title;
    private String content;

    @Enumerated(EnumType.STRING)
    private NotificationType type; // INFO, WARNING, ACTION, BLOOD_REQUEST, etc.

    private boolean isRead = false;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}

