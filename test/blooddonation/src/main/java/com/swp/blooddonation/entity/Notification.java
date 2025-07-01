package com.swp.blooddonation.entity;

import jakarta.persistence.*;


import java.util.Date;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationId;

    private String content;
    private Date date;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Account account;
}
