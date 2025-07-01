package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.AccountDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.service.AdminService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.swp.blooddonation.repository.AccountRepository;
import java.util.stream.Collectors;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminAPI {

    @Autowired
    AdminService adminService;
    // Lấy thông tin admin đang đăng nhập
    @GetMapping("/me")
    public ResponseEntity<AccountDTO> getAdminInfo() {
        Account admin = adminService.getCurrentAdmin();

        // Tạo DTO thủ công
        AccountDTO dto = new AccountDTO();
        dto.setId(admin.getId());
        dto.setEmail(admin.getEmail());
        dto.setFullName(admin.getFullName());
        dto.setRole(admin.getRole());

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/users")
    public ResponseEntity<List<AccountDTO>> getAllUsers() {
        List<Account> accounts = adminService.getAllUsers();

        // Convert sang DTO
        List<AccountDTO> dtos = accounts.stream().map(account -> {
            AccountDTO dto = new AccountDTO();
            dto.setId(account.getId());
            dto.setEmail(account.getEmail());
            dto.setFullName(account.getFullName());
            dto.setRole(account.getRole());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<String> updateUserRole(
            @PathVariable Long userId,
            @RequestParam Role role) {
        adminService.updateUserRole(userId, role);
        return ResponseEntity.ok("Vai trò người dùng đã được cập nhật thành công.");
    }

    // Kích hoạt / vô hiệu hóa tài khoản
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<String> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam boolean enabled) {
        adminService.updateUserStatus(userId, enabled);
        return ResponseEntity.ok("Trạng thái tài khoản đã được cập nhật thành công.");
    }

    // Xóa tài khoản
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok("Tài khoản đã được xóa thành công.");
    }

}