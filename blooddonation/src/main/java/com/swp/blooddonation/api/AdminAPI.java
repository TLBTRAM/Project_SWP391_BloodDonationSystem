package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.UpdateRoleRequest;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.service.AccountService;
import com.swp.blooddonation.service.TokenService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor
public class AdminAPI {

    private final AccountService accountService;
    private final TokenService tokenService;

    @PreAuthorize("hasRole('ADMIN')")

    @PutMapping("/update-role")
    public ResponseEntity<?> updateRole(@RequestBody UpdateRoleRequest updateRoleRequest) {
        Account updatedAccount = accountService.updateRole(updateRoleRequest);
        String newToken = tokenService.generateToken(updatedAccount);  // cấp token mới với role mới

        return ResponseEntity.ok(
                Map.of(
                        "message", "Role updated successfully",
                        "newRole", updatedAccount.getRole().name(),
                        "newToken", newToken
                )
        );
    }

}
