package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.request.LoginRequest;
import com.swp.blooddonation.dto.request.RegisRequest;
import com.swp.blooddonation.dto.request.ResetPasswordRequest;
import com.swp.blooddonation.dto.response.AccountResponse;
import com.swp.blooddonation.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication management APIs")
@CrossOrigin("*")
public class AuthenticationAPI {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Register a new user account")
    public ResponseEntity<String> register(@RequestBody RegisRequest request) {
        authenticationService.register(request);
        return ResponseEntity.ok("Đăng ký thành công!");
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user with email and password")
    public ResponseEntity<AccountResponse> login(@RequestBody LoginRequest request) {
        AccountResponse response = authenticationService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/google")
    @Operation(summary = "Google OAuth login", description = "Authenticate user with Google OAuth")
    public ResponseEntity<AccountResponse> googleLogin(@RequestBody Map<String, String> googleUser) {
        String email = googleUser.get("email");
        String fullName = googleUser.get("fullName");
        String googleId = googleUser.get("googleId");
        String picture = googleUser.get("picture");
        
        AccountResponse response = authenticationService.googleLogin(email, fullName, googleId, picture);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/send-reset-code")
    @Operation(summary = "Send reset password email", description = "Send OTP to user's email for password reset")
    public ResponseEntity<String> sendResetCode(@RequestParam String email) {
        authenticationService.sendResetCode(email);
        return ResponseEntity.ok("Mã xác minh đã được gửi về email.");
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Reset password with new password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        authenticationService.resetPassword(request);
        return ResponseEntity.ok("Đặt lại mật khẩu thành công!");
    }
}
