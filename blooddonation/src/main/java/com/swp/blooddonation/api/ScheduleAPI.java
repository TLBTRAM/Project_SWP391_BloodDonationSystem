package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.request.ScheduleRequestDTO;
import com.swp.blooddonation.dto.response.ScheduleResponseDTO;
import com.swp.blooddonation.service.ScheduleService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SecurityRequirement(name = "api")
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleAPI {

    private final ScheduleService scheduleService;
    @PreAuthorize("hasRole('ADMIN') or hasRole('MEDICALSTAFF')")
    @PostMapping
    public ResponseEntity<ScheduleResponseDTO> createSchedule(@RequestBody ScheduleRequestDTO request) {
        ScheduleResponseDTO response = scheduleService.createSchedule(request);
        return ResponseEntity.ok(response);
    }

    // Lấy schedule theo ngày
    @PreAuthorize("hasRole('ADMIN') or hasRole('MEDICALSTAFF')")
    @GetMapping(params = "date")
    public ResponseEntity<java.util.List<ScheduleResponseDTO>> getSchedulesByDate(@RequestParam("date") java.time.LocalDate date) {
        return ResponseEntity.ok(scheduleService.getSchedulesByDate(date));
    }

    // Lấy schedule theo tháng
    @PreAuthorize("hasRole('ADMIN') or hasRole('MEDICALSTAFF')")
    @GetMapping(params = {"month", "year"})
    public ResponseEntity<java.util.List<ScheduleResponseDTO>> getSchedulesByMonth(@RequestParam("month") int month, @RequestParam("year") int year) {
        return ResponseEntity.ok(scheduleService.getSchedulesByMonth(month, year));
    }

    // Lấy schedule theo trạng thái
    @PreAuthorize("isAuthenticated()")
    @GetMapping(params = "status")
    public ResponseEntity<java.util.List<ScheduleResponseDTO>> getSchedulesByStatus(@RequestParam("status") com.swp.blooddonation.enums.ScheduleStatus status) {
        return ResponseEntity.ok(scheduleService.getSchedulesByStatus(status));
    }

    // Tạo lịch cho cả tháng
    @PreAuthorize("hasRole('ADMIN') or hasRole('MEDICALSTAFF')")
    @PostMapping("/month")
    public ResponseEntity<java.util.List<ScheduleResponseDTO>> createSchedulesForMonth(@RequestParam("month") int month, @RequestParam("year") int year) {
        return ResponseEntity.ok(scheduleService.createSchedulesForMonth(month, year));
    }

    // Cập nhật trạng thái schedule (OPEN hoặc CLOSED)
    @PreAuthorize("hasRole('ADMIN') or hasRole('MEDICALSTAFF')")
    @PatchMapping("/{id}/status")
    public ResponseEntity<ScheduleResponseDTO> updateScheduleStatus(@PathVariable("id") Long id, @RequestParam("status") com.swp.blooddonation.enums.ScheduleStatus status) {
        return ResponseEntity.ok(scheduleService.updateScheduleStatus(id, status));
    }

    // Đóng các schedule đã qua ngày hôm nay (thủ công)
    @PreAuthorize("hasRole('ADMIN') or hasRole('MEDICALSTAFF')")
    @PatchMapping("/close-expired")
    public ResponseEntity<String> closeExpiredSchedulesManually() {
        int count = scheduleService.closeExpiredSchedulesManually();
        return ResponseEntity.ok("Đã đóng " + count + " schedule quá hạn.");
    }
}