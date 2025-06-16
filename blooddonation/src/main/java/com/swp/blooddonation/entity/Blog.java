package com.swp.blooddonation.entity;

import jakarta.persistence.*;

import java.util.Date;


@Entity
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long blogId;

    private String title;
    private String content;
    private Date createdDate;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account user;

    // Nếu bạn không dùng Lombok, thêm getter/setter
}
