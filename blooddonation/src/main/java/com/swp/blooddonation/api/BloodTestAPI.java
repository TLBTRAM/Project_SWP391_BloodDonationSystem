package com.swp.blooddonation.api;

import com.swp.blooddonation.entity.BloodTest;
import com.swp.blooddonation.service.BloodTestService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

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
    public ResponseEntity<BloodTest> complete(@PathVariable Long id, @RequestParam String result, @RequestParam boolean passed) {
        return ResponseEntity.ok(bloodTestService.completeBloodTest(id, result, passed));
    }
}
