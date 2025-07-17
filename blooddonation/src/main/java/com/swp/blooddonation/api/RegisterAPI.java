package com.swp.blooddonation.api;


import com.swp.blooddonation.dto.request.CancelRegisterRequest;
import com.swp.blooddonation.dto.request.RegisterRequest;
import com.swp.blooddonation.dto.request.RejectRequest;
import com.swp.blooddonation.dto.request.StatusUpdateRequest;
import com.swp.blooddonation.dto.response.RegisterResponse;
import com.swp.blooddonation.entity.Appointment;
import com.swp.blooddonation.entity.Register;
import com.swp.blooddonation.enums.RegisterStatus;
import com.swp.blooddonation.service.RegisterService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registers")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor

// CLASS NÀU LÀ MỘT API ĐỂ TẠO MỚI ĐĂNG KÝ ĐĂT LỊCH HIẾN MÁU
public class RegisterAPI {

    private final RegisterService registerService;

    @PostMapping("/donationRegister")
    public ResponseEntity<RegisterResponse> donationRegister(@RequestBody RegisterRequest request) {
        RegisterResponse register = registerService.createRegisterAndReturn(request);
        return ResponseEntity.ok(register);
    }

    /**
     * API cho phép MEDICALSTAFF xem tất cả đơn đăng ký
     */
    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @GetMapping("/all")
    public ResponseEntity<List<RegisterResponse>> getAllRegisters() {
        List<RegisterResponse> registers = registerService.getAllRegisters();
        return ResponseEntity.ok(registers);
    }

    /**
     * MEDICALSTAFF chấp nhận đơn đăng ký
     */
    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveRegister(@PathVariable Long id) {
        Appointment appointment = registerService.approveRegister(id);
        return ResponseEntity.ok(appointment);
    }


    /**
     * MEDICALSTAFF từ chối đơn đăng ký
     */
    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @PostMapping("/{id}/reject")
    public void rejectRegister(@PathVariable("id") Long id, @RequestBody RejectRequest request) {
        registerService.rejectRegister(id, request.getReason());
    }

    /**
     * CUSTOMER hủy đơn đăng ký ở trạng thái PENDING
     */
    @PreAuthorize("hasRole('CUSTOMER')")
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Register> cancelRegister(
            @PathVariable Long id,
            @RequestBody CancelRegisterRequest request) {

        Register register = registerService.cancelRegisterByCustomer(id, request.getReason());
        return ResponseEntity.ok(register);
    }

    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @PostMapping("/{id}/status-update")
    public ResponseEntity<?> updateRegisterStatus(@PathVariable("id") Long id, @RequestBody StatusUpdateRequest request) {
        if (request.getStatus() != RegisterStatus.APPROVED && request.getStatus() != RegisterStatus.REJECTED && request.getStatus() != RegisterStatus.PENDING) {
            return ResponseEntity.badRequest().body("Chỉ được cập nhật sang trạng thái PENDING, APPROVED hoặc REJECTED.");
        }
        registerService.updateRegisterStatus(id, request.getStatus(), request.getReason());
        return ResponseEntity.ok("Cập nhật trạng thái thành công.");
    }

    /**
     * API cho phép MEDICALSTAFF xem tất cả đơn đăng ký đã được duyệt (APPROVED)
     */
    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @GetMapping("/approved")
    public ResponseEntity<List<RegisterResponse>> getApprovedRegisters() {
        List<RegisterResponse> registers = registerService.getApprovedRegisters();
        return ResponseEntity.ok(registers);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my")
    public ResponseEntity<List<RegisterResponse>> getMyRegisters(@org.springframework.security.core.annotation.AuthenticationPrincipal com.swp.blooddonation.entity.Account account) {
        List<RegisterResponse> registers = registerService.getRegistersByAccount(account);
        return ResponseEntity.ok(registers);
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/my-pending")
    public ResponseEntity<List<RegisterResponse>> getMyPendingRegisters(@org.springframework.security.core.annotation.AuthenticationPrincipal com.swp.blooddonation.entity.Account account) {
        List<RegisterResponse> registers = registerService.getPendingRegistersByAccount(account);
        return ResponseEntity.ok(registers);
    }


}