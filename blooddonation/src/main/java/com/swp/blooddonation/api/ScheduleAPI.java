package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.request.ScheduleRequestDTO;
import com.swp.blooddonation.dto.response.ScheduleResponseDTO;
import com.swp.blooddonation.entity.AccountSchedule;
import com.swp.blooddonation.entity.Schedule;
import com.swp.blooddonation.entity.User;
import com.swp.blooddonation.enums.ScheduleStatus;
import com.swp.blooddonation.repository.AccountScheduleRepository;
import com.swp.blooddonation.repository.ScheduleRepository;
import com.swp.blooddonation.service.ScheduleService;
import com.swp.blooddonation.service.UserService;
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

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@SecurityRequirement(name = "api")
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleAPI {

    private final ScheduleService scheduleService;
    private final AccountScheduleRepository accountScheduleRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserService userService;
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

    // API lấy danh sách schedule có status OPEN
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/open")
    public ResponseEntity<List<ScheduleResponseDTO>> getOpenSchedules() {
        List<ScheduleResponseDTO> openSchedules = scheduleService.getSchedulesByStatus(ScheduleStatus.OPEN);
        return ResponseEntity.ok(openSchedules);
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

    // API cho medical staff đăng ký lịch làm việc (schedule) cho 1 ngày
    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @PostMapping("/register-work")
    public ResponseEntity<String> registerWorkSchedule(@RequestParam("scheduleId") Long scheduleId) {
        User currentUser = userService.getCurrentUser();
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy schedule!"));
        if (schedule.getStatus() != ScheduleStatus.OPEN) {
            return ResponseEntity.badRequest().body("Chỉ được đăng ký ngày có trạng thái OPEN!");
        }
        boolean exists = accountScheduleRepository.existsByUserAndSchedule(currentUser, schedule);
        if (exists) {
            return ResponseEntity.badRequest().body("Bạn đã đăng ký lịch làm việc cho ngày này!");
        }
        AccountSchedule accountSchedule = new AccountSchedule();
        accountSchedule.setUser(currentUser);
        accountSchedule.setSchedule(schedule);
        accountScheduleRepository.save(accountSchedule);
        return ResponseEntity.ok("Đăng ký lịch làm việc thành công!");
    }

    // API cho medical staff lấy tất cả ngày đã đăng ký (chưa qua)
    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @GetMapping("/medicalstaff-registered")
    public ResponseEntity<List<ScheduleResponseDTO>> getMedicalStaffRegisteredSchedules() {
        User currentUser = userService.getCurrentUser();
        LocalDate today = LocalDate.now();
        List<AccountSchedule> registered = accountScheduleRepository.findAll().stream()
            .filter(a -> a.getUser().getId().equals(currentUser.getId()) && !a.getSchedule().getScheduleDate().isBefore(today))
            .collect(Collectors.toList());
        List<ScheduleResponseDTO> result = registered.stream()
            .map(a -> scheduleService.getSchedulesByDate(a.getSchedule().getScheduleDate()))
            .flatMap(List::stream)
            .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // API mở lại schedule thủ công (reopen)
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'MEDICALSTAFF')")
    @PatchMapping("/{id}/reopen")
    public ResponseEntity<ScheduleResponseDTO> reopenSchedule(@PathVariable("id") Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy schedule!"));
        if (schedule.getStatus() == ScheduleStatus.OPEN) {
            return ResponseEntity.badRequest().body(null);
        }
        schedule.setStatus(ScheduleStatus.OPEN);
        Schedule saved = scheduleRepository.save(schedule);
        ScheduleResponseDTO dto = scheduleService.getSchedulesByDate(saved.getScheduleDate()).stream()
            .filter(s -> s.getId().equals(saved.getId()))
            .findFirst().orElse(null);
        return ResponseEntity.ok(dto);
    }
}