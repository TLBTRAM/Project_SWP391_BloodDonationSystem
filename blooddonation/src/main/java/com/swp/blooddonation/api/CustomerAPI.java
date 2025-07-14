//package com.swp.blooddonation.api;
//
//import com.swp.blooddonation.dto.CustomerDTO;
//import com.swp.blooddonation.dto.DonationHistoryDTO;
//import com.swp.blooddonation.entity.Account;
//import com.swp.blooddonation.entity.User;
//import com.swp.blooddonation.service.UserService;
//import io.swagger.v3.oas.annotations.security.SecurityRequirement;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/customer")
//@SecurityRequirement(name = "api")
//@RequiredArgsConstructor
//public class CustomerAPI {
//
//    private final UserService userService;
//
//    //  Lấy hồ sơ cá nhân
////    @GetMapping("/profile")
////    public ResponseEntity<CustomerDTO> getProfile(@AuthenticationPrincipal User user) {
////        return ResponseEntity.ok(userService.getProfile(user));
////    }
//
//    //  Lịch sử hiến máu
//    @GetMapping("/donation-history")
//    public ResponseEntity<List<DonationHistoryDTO>> getDonationHistory(@AuthenticationPrincipal Account account) {
//        return ResponseEntity.ok(userService.getDonationHistory(account));
//    }
//
//    //Gợi ý ngày hiến máu tiếp theo
//    @GetMapping("/donation-recommendation")
//    public ResponseEntity<String> getDonationRecommendation(@AuthenticationPrincipal Account account) {
//        return ResponseEntity.ok(userService.getDonationRecommendation(account));
//    }
//
//    // Xem thời điểm sẵn sàng hiến máu tiếp theo
//    @GetMapping("/ready-date")
//    public ResponseEntity<UserService.ReadyDateResponse> getReadyDate(@AuthenticationPrincipal Account account) {
//        return ResponseEntity.ok(userService.getReadyDate(account));
//    }
//}
//
//
