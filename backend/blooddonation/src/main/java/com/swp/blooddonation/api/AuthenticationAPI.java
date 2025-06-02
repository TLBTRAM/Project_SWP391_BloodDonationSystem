package com.swp.blooddonation.api;

import com.swp.blooddonation.entity.User;
import com.swp.blooddonation.model.LoginRequest;
import com.swp.blooddonation.model.ResetPasswordRequest;
import com.swp.blooddonation.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api")
public class AuthenticationAPI {

    @Autowired
    AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity register(@Valid @RequestBody User user){
        // nhờ thằng AuthenticationService => tạo dùm account
        User newUser = authenticationService.register(user);
        return  ResponseEntity.ok(newUser);
    }



    @PostMapping("/login")
    public ResponseEntity login(@Valid @RequestBody LoginRequest loginRequest) {
         User user = authenticationService.login(loginRequest);
        return ResponseEntity.ok(user);
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

}
