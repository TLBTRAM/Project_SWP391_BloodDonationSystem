package com.swp.blooddonation.api;

import com.swp.blooddonation.enums.BloodType;
import com.swp.blooddonation.enums.RhType;
import com.swp.blooddonation.util.BloodCompatibilityUtil;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/compatibility")
@SecurityRequirement(name = "api")
public class BloodCompatibilityAPI {
    
    @GetMapping("/whole-blood")
    public List<String> getCompatibleWholeBloodDonors(
            @RequestParam BloodType recipientType,
            @RequestParam RhType rh
    ) {
        return BloodCompatibilityUtil.getCompatibleWholeBloodDonors(recipientType, rh);
    }

    @GetMapping("/red-cell")
    public List<String> getCompatibleRedCellDonors(
            @RequestParam BloodType recipientType,
            @RequestParam RhType rh
    ) {
        return BloodCompatibilityUtil.getCompatibleRedCellDonors(recipientType, rh);
    }

    @GetMapping("/plasma")
    public List<String> getCompatiblePlasmaDonors(
            @RequestParam BloodType recipientType,
            @RequestParam RhType rh
    ) {
        return BloodCompatibilityUtil.getCompatiblePlasmaDonors(recipientType, rh);
    }

    @GetMapping("/platelet")
    public List<String> getCompatiblePlateletDonors(
            @RequestParam BloodType recipientType,
            @RequestParam RhType rh
    ) {
        return BloodCompatibilityUtil.getCompatiblePlateletDonors(recipientType, rh);
    }
} 