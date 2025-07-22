package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.request.BloodRequestRequest;
import com.swp.blooddonation.dto.request.ComponentBloodRequestRequest;
import com.swp.blooddonation.entity.WholeBloodRequest;
import com.swp.blooddonation.service.BloodRequestService;
import com.swp.blooddonation.entity.BloodRequestComponent;
import com.swp.blooddonation.repository.BloodRequestComponentRepository;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SecurityRequirement(name = "api")
@RequestMapping("/api/blood-requests")
public class BloodRequestAPI {


    @Autowired
    BloodRequestService bloodRequestService;

    @Autowired
    BloodRequestComponentRepository bloodRequestComponentRepository;


    @PreAuthorize("hasRole('CUSTOMER') or hasRole('MEDICALSTAFF')")
    @PostMapping("/create")
    public ResponseEntity<?> createRequest(@Valid @RequestBody BloodRequestRequest bloodRequestRequest) {
        WholeBloodRequest result = bloodRequestService.requestBlood(bloodRequestRequest);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasRole('CUSTOMER') or hasRole('MEDICALSTAFF')")
    @PostMapping("/blood-requests/component")
    public ResponseEntity<?> requestBloodByComponent(@RequestBody @Valid ComponentBloodRequestRequest dto) {
        bloodRequestService.requestBloodByComponent(dto);
        return ResponseEntity.ok("Gửi yêu cầu truyền thành phần máu thành công.");
    }

    @PreAuthorize("hasRole('CUSTOMER') or hasRole('MEDICALSTAFF')")
    @PutMapping("/whole-requests/{id}/cancel")
    public ResponseEntity<?> cancelWholeRequest(@PathVariable Long id) {
        bloodRequestService.cancelWholeBloodRequest(id);
        return ResponseEntity.ok("Đã huỷ yêu cầu truyền máu.");
    }


    @PreAuthorize("hasAnyRole('MANAGER', 'MEDICALSTAFF')")
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveBloodRequest(@PathVariable("id") Long id) {
        bloodRequestService.approveBloodRequest(id);
        return ResponseEntity.ok("Phê duyệt yêu cầu thành công.");
    }

    @PreAuthorize("hasAnyRole('MANAGER', 'MEDICALSTAFF')")
    @PutMapping("/component/{id}/approve")
    public ResponseEntity<?> approveComponentBloodRequest(@PathVariable("id") Long id) {
        bloodRequestService.approveComponentRequest(id);
        return ResponseEntity.ok("Phê duyệt yêu cầu truyền thành phần máu thành công.");
    }
    @PreAuthorize("hasAnyRole('MANAGER', 'MEDICALSTAFF')")
    @PutMapping("/whole-requests/{id}/complete")
    public ResponseEntity<?> completeWholeRequest(@PathVariable Long id) {
        bloodRequestService.completeWholeBloodRequest(id);
        return ResponseEntity.ok("Đã hoàn tất yêu cầu truyền máu.");
    }

    @PreAuthorize("hasAnyRole('MANAGER', 'MEDICALSTAFF')")
    @PutMapping("/whole-requests/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id, @RequestParam String reason) {
        bloodRequestService.rejectWholeBloodRequest(id, reason);
        return ResponseEntity.ok("Đã từ chối yêu cầu truyền máu.");
    }

    @PreAuthorize("hasAnyRole('MANAGER', 'MEDICALSTAFF')")
    @PutMapping("/component/{id}/complete")
    public ResponseEntity<?> completeComponentRequest(@PathVariable Long id) {
        bloodRequestService.completeComponentBloodRequest(id);
        return ResponseEntity.ok("Đã hoàn tất yêu cầu truyền máu thành phần.");
    }

    @PreAuthorize("hasAnyRole('MANAGER', 'MEDICALSTAFF')")
    @PutMapping("/component/{id}/reject")
    public ResponseEntity<?> rejectComponentRequest(@PathVariable Long id, @RequestParam String reason) {
        bloodRequestService.rejectComponentBloodRequest(id, reason);
        return ResponseEntity.ok("Đã từ chối yêu cầu truyền máu thành phần.");
    }

    @PreAuthorize("hasAnyRole('MANAGER', 'MEDICALSTAFF')")
    @GetMapping("/all")
    public ResponseEntity<List<WholeBloodRequest>> getAllBloodRequests() {
        List<WholeBloodRequest> requests = bloodRequestService.getAllBloodRequests();
        return ResponseEntity.ok(requests);
    }

    @PreAuthorize("hasAnyRole('MANAGER', 'MEDICALSTAFF')")
    @GetMapping("/component/all")
    public ResponseEntity<List<BloodRequestComponent>> getAllComponentBloodRequests() {
        List<BloodRequestComponent> requests = bloodRequestComponentRepository.findAll();
        return ResponseEntity.ok(requests);
    }

    @PreAuthorize("hasAnyRole('CUSTOMER', 'MEDICALSTAFF')")
    @PutMapping("/component/{id}/cancel")
    public ResponseEntity<?> cancelComponentBloodRequest(@PathVariable Long id) {
        bloodRequestService.cancelRequestComponent(id);
        return ResponseEntity.ok("Yêu cầu truyền máu thành phần đã được huỷ.");
    }




}