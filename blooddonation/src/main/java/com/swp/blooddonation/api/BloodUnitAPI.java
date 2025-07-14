package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.request.BloodComponentVolumeRequest;
import com.swp.blooddonation.dto.request.CollectBloodRequest;
import com.swp.blooddonation.dto.request.UpdateBloodUnitStatusRequest;
import com.swp.blooddonation.entity.BloodUnit;
import com.swp.blooddonation.service.BloodTestService;
import com.swp.blooddonation.service.BloodUnitService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blood")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor
public class BloodUnitAPI {

    @Autowired
    BloodUnitService bloodUnitService;

    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @PostMapping("/collect")
    public ResponseEntity<BloodUnit> collectBlood(@RequestBody CollectBloodRequest request) {
        return ResponseEntity.ok(bloodUnitService.collectBlood(request));
    }

    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @PostMapping("/separate/{id}")
    public ResponseEntity<BloodUnit> separateBlood(@PathVariable Long id,
                                                   @RequestBody BloodComponentVolumeRequest request) {
        return ResponseEntity.ok(bloodUnitService.separateBlood(id, request));
    }

    // Lấy danh sách túi máu
    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/units")
    public ResponseEntity<List<BloodUnit>> getAllBloodUnits() {
        return ResponseEntity.ok(bloodUnitService.getAllBloodUnits());
    }

    // Lấy chi tiết túi máu
    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/units/{id}")
    public ResponseEntity<BloodUnit> getBloodUnitById(@PathVariable Long id) {
        return bloodUnitService.getBloodUnitById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Cập nhật trạng thái túi máu
    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/units/{id}/status")
    public ResponseEntity<BloodUnit> updateBloodUnitStatus(
            @PathVariable Long id,
            @RequestBody UpdateBloodUnitStatusRequest request
    ) {
        BloodUnit updated = bloodUnitService.updateBloodUnitStatus(id, request.getStatus());
        return ResponseEntity.ok(updated);
    }
}
