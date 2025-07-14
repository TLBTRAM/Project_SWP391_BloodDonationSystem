package com.swp.blooddonation.api;

import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.service.AdminService;
import com.swp.blooddonation.entity.User;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminAPI {

    @Autowired
    AdminService adminService;



    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<String> updateUserRole(
            @PathVariable Long userId,
            @RequestParam Role role) {
        adminService.updateUserRole(userId, role);
        return ResponseEntity.ok("Vai trò người dùng đã được cập nhật thành công.");
    }

    // Kích hoạt / vô hiệu hóa tài khoản
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<String> updateUserStatus(
            @PathVariable Long userId,
            @RequestParam boolean enabled) {
        adminService.updateUserStatus(userId, enabled);
        return ResponseEntity.ok("Trạng thái tài khoản đã được cập nhật thành công.");
    }

    // Xóa tài khoản
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok("Tài khoản đã được xóa thành công.");
    }

    // Lấy danh sách user theo role hoặc tất cả user
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsersByRole(@RequestParam(required = false) Role role) {
        if (role != null) {
            return ResponseEntity.ok(adminService.getUsersByRole(role));
        } else {
            return ResponseEntity.ok(adminService.getAllUsers());
        }
    }

}
