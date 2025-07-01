package com.swp.blooddonation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ManagerDTO {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String note; // nếu bạn dùng thêm trường này trong Manager entity
}
