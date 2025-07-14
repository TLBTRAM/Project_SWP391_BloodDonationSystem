package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.*;
import com.swp.blooddonation.dto.request.LoginRequest;
import com.swp.blooddonation.dto.request.RegisRequest;
import com.swp.blooddonation.dto.request.ResetPasswordRequest;
import com.swp.blooddonation.dto.response.AccountResponse;
import com.swp.blooddonation.dto.response.RegisterAccountResponse;
import com.swp.blooddonation.dto.response.RegisterResponse;
import com.swp.blooddonation.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
//@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
public class AuthenticationAPI {

    @Autowired
    AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity register(@Valid @RequestBody RegisRequest regisRequest){
        // nhờ thằng AuthenticationService => tạo dùm account
        RegisterAccountResponse registerAccountResponse = authenticationService.register(regisRequest);
        return  ResponseEntity.ok(registerAccountResponse);
    }


    @PostMapping("/login")
    public ResponseEntity login(@Valid @RequestBody LoginRequest loginRequest) {
         AccountResponse account = authenticationService.login(loginRequest);
        return ResponseEntity.ok(account);
    }

    @PostMapping("/send-reset-code")
    public ResponseEntity sendResetCode(@RequestParam String email) {
        authenticationService.sendResetCode(email);
        return ResponseEntity.ok("Mã xác minh đã được gửi về email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity resetPassword(@Valid @RequestBody ResetPasswordRequest resetPasswordRequest) {
        authenticationService.resetPassword(resetPasswordRequest);
//        return ResponseEntity.ok("Đặt lại mật khẩu thành công.");
        return ResponseEntity.ok("Đặt lại mật khẩu thành công.");
    }
//    @PostMapping("/change-password")
//    public ResponseEntity changePassword(@Valid @RequestBody ChangePassswordRequest changePassswordRequest) {
//        User user = authenticationService.changePassword(changePassswordRequest);
//        return ResponseEntity.ok(user);
//    }


    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @GetMapping("/medical-staff")
    public ResponseEntity getMedicalStaff() {
         List<MedicalStaffDTO> medicalStaffDTO = authenticationService.getMedicalStaff();
        return ResponseEntity.ok(medicalStaffDTO);
    }

}
