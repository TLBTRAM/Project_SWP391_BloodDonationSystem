package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.MedicalStaffDTO;
import com.swp.blooddonation.dto.MedicalStaffUpdateDTO;
import com.swp.blooddonation.dto.TestResultDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.service.MedicalStaffService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-staff")
@RequiredArgsConstructor
public class MedicalStaffAPI {

    private final MedicalStaffService medicalStaffService;

    //Xem tất cả xét nghiệm mình đã làm
    @GetMapping("/test-results")
    @PreAuthorize("hasRole('MEDICALSTAFF')")
    public ResponseEntity<List<TestResultDTO>> getAllResults(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(medicalStaffService.getAllTestResults(account));
    }

    // Tạo xét nghiệm mới cho 1 customer
//    @PostMapping("/test-results")
//    @PreAuthorize("hasRole('MEDICALSTAFF')")
//    public ResponseEntity<String> createResult(@AuthenticationPrincipal Account account,
//                                               @RequestBody TestResultDTO dto) {
//        medicalStaffService.createTestResult(account, dto);
//        return ResponseEntity.ok("Kết quả xét nghiệm đã được lưu.");
//    }

    // Xem chi tiết 1 kết quả
    @GetMapping("/test-results/{id}")
    @PreAuthorize("hasRole('MEDICALSTAFF')")
    public ResponseEntity<TestResultDTO> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(medicalStaffService.getTestResultById(id));
    }
}
