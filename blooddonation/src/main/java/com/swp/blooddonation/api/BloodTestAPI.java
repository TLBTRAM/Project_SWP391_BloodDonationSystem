package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.response.BloodTestResponse;
import com.swp.blooddonation.dto.CompleteBloodTest;
import com.swp.blooddonation.entity.BloodTest;
import com.swp.blooddonation.service.BloodTestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@SecurityRequirement(name = "api")
@RequestMapping("/api/blood-test")
public class BloodTestAPI {

    @Autowired
    private BloodTestService bloodTestService;

    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @PostMapping("/create")
    public ResponseEntity<BloodTest> create(@RequestParam Long customerId){
        BloodTest bloodTest = bloodTestService.createBloodTest(customerId);
        return ResponseEntity.ok(bloodTest);
    }

//    @PreAuthorize("hasRole('MEDICALSTAFF')")
//    @PutMapping("/{id}/start")
//    public ResponseEntity<BloodTest> start(@PathVariable Long id) {
//        return ResponseEntity.ok(bloodTestService.startBloodTest(id));
//    }
    
    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @PutMapping("/{id}/complete")
    public ResponseEntity<BloodTestResponse> complete(
            @PathVariable Long id, // id này là registerId
            @RequestBody CompleteBloodTest request
    ) {
        BloodTestResponse response = bloodTestService.completeBloodTestByRegister(id, request);
        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @GetMapping("/completed")
    public ResponseEntity<java.util.List<BloodTestResponse>> getCompletedBloodTests() {
        return ResponseEntity.ok(bloodTestService.getAllCompletedBloodTests());
    }
}
