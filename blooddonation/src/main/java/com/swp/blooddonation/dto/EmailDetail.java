package com.swp.blooddonation.dto;

import lombok.Data;

@Data
public class EmailDetail {
    private String mailRecipient;
    private String subject;
    private String name;
}
