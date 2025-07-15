package com.swp.blooddonation.api;


import com.swp.blooddonation.dto.request.CancelRegisterRequest;
import com.swp.blooddonation.dto.request.RegisterRequest;
import com.swp.blooddonation.dto.request.RejectRequest;
import com.swp.blooddonation.entity.Appointment;
import com.swp.blooddonation.entity.Register;
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
    public ResponseEntity<Register> donationRegister(@RequestBody RegisterRequest request) {
        Register register = registerService.createRegister(request);
        return ResponseEntity.ok(register);
    }

    /**
     * API cho phép MEDICALSTAFF xem tất cả đơn đăng ký
     */
    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @GetMapping("/all")
    public ResponseEntity<List<Register>> getAllRegisters() {
        List<Register> registers = registerService.getAllRegisters();
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



}