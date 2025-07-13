package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.AccountDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.service.AccountService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@SecurityRequirement(name = "api")
@CrossOrigin("*")
public class AccountAPI {

    @Autowired
    AccountService accountService;

    // Cập nhật hồ sơ người dùng
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/update-profile")
    public ResponseEntity<String> updateProfile(@AuthenticationPrincipal Account account,
                                                @RequestBody AccountDTO updateDTO) {
        accountService.updateProfile(account, updateDTO);
        return ResponseEntity.ok("Cập nhật thông tin thành công.");
    }

    // Đăng xuất
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@AuthenticationPrincipal Account account) {
        accountService.logout(account);
        return ResponseEntity.ok("Đã đăng xuất.");
    }

    // Lấy thông tin profile của user hiện tại
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/profile")
    public ResponseEntity<Account> getProfile(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(accountService.getProfile(account.getId()));
    }


}
