package com.swp.blooddonation.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackId;

    private String content;
    private Integer rate;
    private Date date;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Account account;
}
