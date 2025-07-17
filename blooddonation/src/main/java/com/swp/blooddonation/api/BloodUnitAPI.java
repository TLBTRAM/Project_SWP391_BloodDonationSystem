package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.request.BloodComponentVolumeRequest;
import com.swp.blooddonation.dto.request.CollectBloodRequest;
import com.swp.blooddonation.dto.request.UpdateBloodUnitStatusRequest;
import com.swp.blooddonation.dto.request.ManualBloodUnitRequest;
import com.swp.blooddonation.entity.BloodUnit;
import com.swp.blooddonation.entity.BloodComponent;
import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.RhType;
import com.swp.blooddonation.service.BloodTestService;
import com.swp.blooddonation.service.BloodUnitService;
import com.swp.blooddonation.dto.response.BloodUnitSimpleResponse;
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

    @PreAuthorize("hasRole('MANAGER') or hasRole('MEDICALSTAFF')")
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

    // Xóa túi máu
    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("/units/{id}")
    public ResponseEntity<Void> deleteBloodUnit(@PathVariable Long id) {
        bloodUnitService.deleteBloodUnit(id);
        return ResponseEntity.noContent().build();
    }

    // Thêm túi máu thủ công (không qua hiến máu)
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    @PostMapping("/manual")
    public ResponseEntity<BloodUnit> addManualBloodUnit(@RequestBody ManualBloodUnitRequest request) {
        BloodUnit unit = bloodUnitService.addManualBloodUnit(
            BloodType.valueOf(request.getBloodType()),
            RhType.valueOf(request.getRhType()),
            request.getTotalVolume(),
            request.getCollectedDate(),
            request.getExpirationDate()
        );
        return ResponseEntity.ok(unit);
    }

    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @GetMapping("/collect/completed")
    public ResponseEntity<List<BloodUnitSimpleResponse>> getCollectedBloodUnits() {
        return ResponseEntity.ok(bloodUnitService.getCollectedBloodUnits());
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/components")
    public ResponseEntity<List<BloodComponent>> getAllBloodComponents() {
        return ResponseEntity.ok(bloodUnitService.getAllBloodComponents());
    }
}
