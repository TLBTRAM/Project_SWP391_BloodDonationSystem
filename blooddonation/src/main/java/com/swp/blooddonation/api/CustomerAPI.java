package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.CustomerDTO;
import com.swp.blooddonation.dto.DonationHistoryDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerAPI {

    private final CustomerService customerService;

    //  Lấy hồ sơ cá nhân
    @GetMapping("/profile")
    public ResponseEntity<CustomerDTO> getProfile(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(customerService.getProfile(account));
    }
//
//    //  Lịch sử hiến máu
//    @GetMapping("/donation-history")
//    public ResponseEntity<List<DonationHistoryDTO>> getDonationHistory(@AuthenticationPrincipal Account account) {
//        return ResponseEntity.ok(customerService.getDonationHistory(account));
//    }
//
//    //Gợi ý ngày hiến máu tiếp theo
//    @GetMapping("/donation-recommendation")
//    public ResponseEntity<String> getDonationRecommendation(@AuthenticationPrincipal Account account) {
//        return ResponseEntity.ok(customerService.getDonationRecommendation(account));
//    }

}

