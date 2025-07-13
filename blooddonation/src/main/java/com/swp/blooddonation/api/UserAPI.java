package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.CustomerDTO;
import com.swp.blooddonation.dto.DonationHistoryDTO;
import com.swp.blooddonation.dto.MedicalStaffDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.User;
import com.swp.blooddonation.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor
public class UserAPI {

    private final UserService userService;

    // Lấy hồ sơ cá nhân (cho tất cả role)

    @GetMapping("/profile")
    public ResponseEntity<CustomerDTO> getProfile() {
        return ResponseEntity.ok(userService.getProfile()); //
    }

    // Lịch sử hiến máu (chỉ cho CUSTOMER)
    @GetMapping("/donation-history")
    public ResponseEntity<List<DonationHistoryDTO>> getDonationHistory(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(userService.getDonationHistory(account));
    }

    // Gợi ý ngày hiến máu tiếp theo (chỉ cho CUSTOMER)
    @GetMapping("/donation-recommendation")
    public ResponseEntity<String> getDonationRecommendation(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(userService.getDonationRecommendation(account));
    }

    // Xem thời điểm sẵn sàng hiến máu tiếp theo (chỉ cho CUSTOMER)
    @GetMapping("/ready-date")
    public ResponseEntity<UserService.ReadyDateResponse> getReadyDate(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(userService.getReadyDate(account));
    }

    // Lấy thông tin Medical Staff (chỉ cho MEDICALSTAFF)
    @GetMapping("/medical-staff-profile")
    public ResponseEntity<MedicalStaffDTO> getMedicalStaffProfile(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(userService.getMedicalStaffProfile(account));
    }

    // Admin: Lấy tất cả Customer
    @GetMapping("/customers")
    public ResponseEntity<List<User>> getAllCustomers() {
        return ResponseEntity.ok(userService.getAllCustomers());
    }

    // Admin: Lấy tất cả Medical Staff
    @GetMapping("/medical-staff")
    public ResponseEntity<List<User>> getAllMedicalStaff() {
        return ResponseEntity.ok(userService.getAllMedicalStaff());
    }

    // Admin: Lấy tất cả Manager
    @GetMapping("/managers")
    public ResponseEntity<List<User>> getAllManagers() {
        return ResponseEntity.ok(userService.getAllManagers());
    }

    // Admin: Lấy User theo Role
    @GetMapping("/by-role/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String role) {
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }

    // Admin: Lấy User theo ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
} 