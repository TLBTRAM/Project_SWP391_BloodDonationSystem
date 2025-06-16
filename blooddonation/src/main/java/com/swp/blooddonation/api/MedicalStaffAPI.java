package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.*;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.Sample;
import com.swp.blooddonation.entity.TestResult;
import com.swp.blooddonation.service.MedicalStaffService;
import com.swp.blooddonation.service.SampleService;
import com.swp.blooddonation.service.TestResultService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/medical-staff")
@PreAuthorize("hasRole('MEDICALSTAFF')")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MedicalStaffAPI {

    private final MedicalStaffService medicalStaffService;
    private final TestResultService testResultService;

    private final SampleService sampleService;


    // ✅ Xem thông tin hồ sơ Medical Staff
    @GetMapping("/me")
    public ResponseEntity<MedicalStaffDTO> getMyProfile(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(medicalStaffService.getProfile(account));
    }

    // ✅ Cập nhật thông tin Medical Staff
    @PutMapping("/update-profile")
    public ResponseEntity<String> updateProfile(@AuthenticationPrincipal Account account,
                                                @RequestBody MedicalStaffUpdateDTO dto) {
        medicalStaffService.updateProfile(account, dto);
        return ResponseEntity.ok("Cập nhật thông tin nhân viên y tế thành công.");
    }
    @PostMapping("/samples/{sampleId}/test-results")
    public ResponseEntity<TestResultResponseDTO> performTest(
            @AuthenticationPrincipal Account account,
            @PathVariable Long sampleId,
            @RequestBody @Valid TestResultRequestDTO testResultRequestDTO
    ) {
        TestResult result = testResultService.performTest(sampleId, account.getId(), testResultRequestDTO);
        TestResultResponseDTO response = testResultService.mapToResponse(result);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createSample(@Valid @RequestBody SampleRequestDTO dto) {
        Sample sample = sampleService.createSample(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(sample);
    }
}