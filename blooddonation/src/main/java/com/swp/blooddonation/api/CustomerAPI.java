package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.BloodRequestDTO;
import com.swp.blooddonation.dto.CustomerDTO;
import com.swp.blooddonation.dto.DonationHistoryDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerAPI {

    private final CustomerService customerService;

    //  Lấy hồ sơ cá nhân
    @GetMapping("/profile")
    public ResponseEntity<CustomerDTO> getProfile(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(customerService.getProfile(account));
    }

    //  Lịch sử hiến máu
    @GetMapping("/donation-history")
    public ResponseEntity<List<DonationHistoryDTO>> getDonationHistory(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(customerService.getDonationHistory(account));
    }

    //Gợi ý ngày hiến máu tiếp theo
    @GetMapping("/donation-recommendation")
    public ResponseEntity<String> getDonationRecommendation(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(customerService.getDonationRecommendation(account));
    }

    //  Tạo yêu cầu nhận máu
    @PostMapping("/blood-request")
    public ResponseEntity<String> createBloodRequest(@AuthenticationPrincipal Account account,
                                                     @RequestBody BloodRequestDTO dto) {
        customerService.createBloodRequest(account, dto);
        return ResponseEntity.ok("Yêu cầu nhận máu đã được tạo.");
    }

    // Medical staff approve blood request
    @PutMapping("/blood-request/{id}/approve")
    public ResponseEntity<String> approveBloodRequest(@AuthenticationPrincipal Account account, @PathVariable Long id) {
        customerService.approveBloodRequest(account, id);
        return ResponseEntity.ok("Yêu cầu nhận máu đã được duyệt.");
    }

    // Medical staff reject blood request
    @PutMapping("/blood-request/{id}/reject")
    public ResponseEntity<String> rejectBloodRequest(@AuthenticationPrincipal Account account, @PathVariable Long id) {
        customerService.rejectBloodRequest(account, id);
        return ResponseEntity.ok("Yêu cầu nhận máu đã bị từ chối.");
    }

    //  Xem danh sách yêu cầu nhận máu
    @GetMapping("/blood-requests")
    public ResponseEntity<List<BloodRequestDTO>> getMyBloodRequests(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(customerService.getMyBloodRequests(account));
    }

    //  Hủy yêu cầu nhận máu
    @DeleteMapping("/blood-request/{id}")
    public ResponseEntity<String> cancelRequest(@AuthenticationPrincipal Account account,
                                                @PathVariable Long id) {
        customerService.cancelRequest(account, id);
        return ResponseEntity.ok("Đã hủy yêu cầu nhận máu.");
    }
}

