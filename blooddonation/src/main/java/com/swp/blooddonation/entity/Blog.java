package com.swp.blooddonation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long blogId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime createdDate;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    @JsonIgnore
    private Account account;

    // Getter cho account để tránh circular reference
    @JsonProperty("authorName")
    public String getAuthorName() {
        return account != null ? account.getFullName() : "Unknown";
    }

    @JsonProperty("authorId")
    public Long getAuthorId() {
        return account != null ? account.getId() : null;
    }
}