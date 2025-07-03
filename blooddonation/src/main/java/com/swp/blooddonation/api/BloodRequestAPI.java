package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.request.BloodRequestRequest;
import com.swp.blooddonation.entity.BloodRequest;
import com.swp.blooddonation.service.BloodRequestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/requests")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor
public class BloodRequestAPI {
    private final BloodRequestService bloodRequestService;


    @PreAuthorize("hasRole('DONOR') or hasRole('MEDICALSTAFF')")
    @PostMapping("/create")
    public ResponseEntity<?> createRequest(@Valid @RequestBody BloodRequestRequest bloodRequestRequest) {
        BloodRequest result = bloodRequestService.requestBlood(bloodRequestRequest);
        return ResponseEntity.ok(result);
    }
}