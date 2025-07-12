package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.AccountDTO;
import com.swp.blooddonation.dto.DonationHistoryDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.service.AccountService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/account")
@SecurityRequirement(name = "api")
@CrossOrigin("*")

public class AccountAPI {

    @Autowired
    AccountService accountService;



    @GetMapping("/me")
    public ResponseEntity<AccountDTO> getProfile(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(accountService.getProfile(account));
    }

    // Cập nhật hồ sơ người dùng (dùng lại AccountDTO cho update)
    @PutMapping("/update-profile")
    public ResponseEntity<String> updateProfile(@AuthenticationPrincipal Account account,
                                                @RequestBody AccountDTO updateDTO) {
        accountService.updateProfile(account, updateDTO);
        return ResponseEntity.ok("Cập nhật thông tin thành công.");
    }

//    //  Đổi mật khẩu
//    @PutMapping("/change-password")
//    public ResponseEntity<String> changePassword(@AuthenticationPrincipal Account account,
//                                                 @RequestBody ChangePasswordDTO dto) {
//        accountService.changePassword(account, dto);
//        return ResponseEntity.ok("Đổi mật khẩu thành công.");
//    }

    //  Đăng xuất (tùy vào hệ thống bạn xử lý như thế nào)
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@AuthenticationPrincipal Account account) {
        accountService.logout(account);
        return ResponseEntity.ok("Đã đăng xuất.");
    }

    @GetMapping("/donation-history")
    public ResponseEntity<List<DonationHistoryDTO>> getDonationHistory(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(accountService.getDonationHistory(account));
    }



    @GetMapping("/donation-recommendation")
    public ResponseEntity<String> getDonationRecommendation(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(accountService.getDonationRecommendation(account));
    }



    @GetMapping("/ready-date")
    public ResponseEntity<AccountService.ReadyDateResponse> getReadyDate(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(accountService.getReadyDate(account));
    }

}
