package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.request.BloodRequestRequest;
import com.swp.blooddonation.dto.request.ComponentBloodRequestRequest;
import com.swp.blooddonation.entity.WholeBloodRequest;
import com.swp.blooddonation.service.BloodRequestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@SecurityRequirement(name = "api")
@RequestMapping("/api/blood-requests")
public class BloodRequestAPI {


    @Autowired
    BloodRequestService bloodRequestService;


    @PreAuthorize("hasRole('CUSTOMER') or hasRole('MEDICALSTAFF')")
    @PostMapping("/create")
    public ResponseEntity<?> createRequest(@Valid @RequestBody BloodRequestRequest bloodRequestRequest) {
        WholeBloodRequest result = bloodRequestService.requestBlood(bloodRequestRequest);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/blood-requests/component")
    public ResponseEntity<?> requestBloodByComponent(@RequestBody @Valid ComponentBloodRequestRequest dto) {
        bloodRequestService.requestBloodByComponent(dto);
        return ResponseEntity.ok("Gửi yêu cầu truyền thành phần máu thành công.");
    }


//    @PreAuthorize("hasAnyRole('MANAGER', 'MEDICALSTAFF')")
//    @PutMapping("/{id}/approve")
//    public ResponseEntity<?> approveBloodRequest(@PathVariable("id") Long id) {
//        bloodRequestService.approveBloodRequest(id);
//        return ResponseEntity.ok("Phê duyệt yêu cầu thành công.");
//    }
}