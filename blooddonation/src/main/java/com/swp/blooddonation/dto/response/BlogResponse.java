package com.swp.blooddonation.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BlogResponse {
    private Long blogId;
    private String title;
    private String content;
    private LocalDateTime createdDate;
    private String authorName;
    private Long authorId;
}