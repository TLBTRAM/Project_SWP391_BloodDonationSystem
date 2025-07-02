package com.swp.blooddonation.api;


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

@RestController
@RequestMapping("/api/registers")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor

// CLASS NÀU LÀ MỘT API ĐỂ TẠO MỚI ĐĂNG KÝ ĐĂT LỊCH HIẾN MÁU
public class RegisterAPI {

    private final RegisterService registerService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("/create")
    public ResponseEntity<Register> createRegister(@RequestBody RegisterRequest request) {
        Register register = registerService.createRegister(request);
        return ResponseEntity.ok(register);
    }

    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @PutMapping("/registers/{id}/approve")
    public ResponseEntity<?> approveRegister(@PathVariable Long id) {
        Appointment appointment = registerService.approveRegister(id);
        return ResponseEntity.ok(appointment);
    }
    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @PostMapping("/{registerId}/reject")
    public void rejectRegister(@PathVariable Long registerId, @RequestBody RejectRequest request) {
        registerService.rejectRegister(registerId, request.getReason());
    }


    @PreAuthorize("hasRole('CUSTOMER')")
    @DeleteMapping("/{registerId}/cancel")
    public void cancelRegister(@PathVariable Long registerId) {
        registerService.cancelRegister(registerId);
    }



}