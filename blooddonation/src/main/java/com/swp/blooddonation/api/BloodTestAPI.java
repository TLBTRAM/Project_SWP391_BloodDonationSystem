package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.response.BloodTestResponse;
import com.swp.blooddonation.dto.CompleteBloodTest;
import com.swp.blooddonation.entity.BloodTest;
import com.swp.blooddonation.service.BloodTestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@SecurityRequirement(name = "api")
@RequestMapping("/api/blood-test")
public class BloodTestAPI {

    @Autowired
    private BloodTestService bloodTestService;

    @PostMapping("/create")
    public ResponseEntity<BloodTest> create(@RequestParam Long customerId){
        BloodTest bloodTest = bloodTestService.createBloodTest(customerId);
        return ResponseEntity.ok(bloodTest);
    }

    @PutMapping("/{id}/start")
    public ResponseEntity<BloodTest> start(@PathVariable Long id) {
        return ResponseEntity.ok(bloodTestService.startBloodTest(id));
    }
    @PutMapping("/{id}/complete")
    public ResponseEntity<BloodTestResponse> complete(
            @PathVariable Long id,
            @RequestBody CompleteBloodTest request
    ) {
        BloodTestResponse response = bloodTestService.completeBloodTest(id, request);
        return ResponseEntity.ok(response);
    }
}
