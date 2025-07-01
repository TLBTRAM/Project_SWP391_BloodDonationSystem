package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.AccountDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.service.AccountService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@SecurityRequirement(name = "api")
@CrossOrigin("*")
public class AccountAPI {

    @Autowired
    AccountService accountService;

    // ✅ Lấy thông tin người dùng hiện tại
    @GetMapping("/me")
    public ResponseEntity<AccountDTO> getProfile() {
        Account account = (Account) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(accountService.getProfile(account));
    }

    // ✅ Cập nhật hồ sơ người dùng
    @PutMapping("/update-profile")
    public ResponseEntity<String> updateProfile(@RequestBody AccountDTO updateDTO) {
        Account account = (Account) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        accountService.updateProfile(account, updateDTO);
        return ResponseEntity.ok("Cập nhật thông tin thành công.");
    }

    // ✅ Đăng xuất
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        Account account = (Account) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        accountService.logout(account);
        return ResponseEntity.ok("Đã đăng xuất.");
    }
}
