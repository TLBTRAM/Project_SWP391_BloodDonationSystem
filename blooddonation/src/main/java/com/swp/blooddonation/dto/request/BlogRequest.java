package com.swp.blooddonation.dto.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class BlogRequest {

    @NotBlank(message = "Tiêu đề không được để trống")
    @Size(min = 5, max = 200, message = "Tiêu đề phải từ 5 đến 200 ký tự")
    private String title;

    @NotBlank(message = "Nội dung không được để trống")
    @Size(min = 10, message = "Nội dung phải có ít nhất 10 ký tự")
    private String content;
}