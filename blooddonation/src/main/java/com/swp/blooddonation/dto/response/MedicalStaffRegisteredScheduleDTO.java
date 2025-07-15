package com.swp.blooddonation.dto.response;

public class MedicalStaffRegisteredScheduleDTO {
    public Long accountScheduleId;
    public String scheduleDate;
    public String status;
    public Long createdBy;
    public MedicalStaffRegisteredScheduleDTO(Long accountScheduleId, String scheduleDate, String status, Long createdBy) {
        this.accountScheduleId = accountScheduleId;
        this.scheduleDate = scheduleDate;
        this.status = status;
        this.createdBy = createdBy;
    }
} 