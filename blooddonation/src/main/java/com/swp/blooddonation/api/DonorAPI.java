package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.*;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.service.DonorService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donor")
@PreAuthorize("hasRole('DONOR')")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DonorAPI {

    private final DonorService donorService;

    // ✅ 1. Lấy thông tin người hiến máu
    @GetMapping("/me")
    public ResponseEntity<DonorDTO> getMyProfile(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(donorService.getProfile(account));
    }

/*
    // ✅ 3. Đặt lịch hiến máu
    @PostMapping("/appointments")
    public ResponseEntity<String> bookAppointment(@AuthenticationPrincipal Account account,
                                                  @RequestBody AppointmentRequestDTO dto) {
        donorService.bookAppointment(account, dto);
        return ResponseEntity.ok("Đặt lịch hiến máu thành công.");
    }

    // ✅ 4. Lấy danh sách lịch hẹn hiến máu
    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentDTO>> getAppointments(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(donorService.getAppointments(account));
    }

    // ✅ 5. Hủy lịch hẹn
    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<String> cancelAppointment(@AuthenticationPrincipal Account account,
                                                    @PathVariable Long id) {
        donorService.cancelAppointment(account, id);
        return ResponseEntity.ok("Hủy lịch hẹn thành công.");
    }

    // ✅ 6. Lịch sử hiến máu
    @GetMapping("/history")
    public ResponseEntity<List<DonationHistoryDTO>> getDonationHistory(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(donorService.getDonationHistory(account));
    }

    // ✅ 7. Gợi ý thời điểm hiến máu tiếp theo
    @GetMapping("/recommendation")
    public ResponseEntity<String> getDonationRecommendation(@AuthenticationPrincipal Account account) {
        String recommendation = donorService.getDonationRecommendation(account);
        return ResponseEntity.ok(recommendation);
    }

 */
}
