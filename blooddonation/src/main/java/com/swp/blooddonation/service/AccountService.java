package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.AccountDTO;
import com.swp.blooddonation.dto.AddressDTO;
import com.swp.blooddonation.dto.DonationHistoryDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.User;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.repository.AccountRepository;
import com.swp.blooddonation.repository.AuthenticationReponsitory;
import com.swp.blooddonation.repository.DonationHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    @Autowired
    AuthenticationReponsitory authenticationReponsitory;
    @Autowired
    AccountRepository accountRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    DonationHistoryRepository donationHistoryRepository;



    //  Trả về thông tin tài khoản hiện tại
//    public AccountDTO getProfile(User user) {
//        AccountDTO dto = modelMapper.map(user, AccountDTO.class);
//
//        AddressDTO addressDTO = new AddressDTO();
//        if (user.getProvince() != null) {
//            addressDTO.setProvinceId(user.getProvince().getId());
//            addressDTO.setProvinceName(user.getProvince().getName());
//        }
//        if (user.getDistrict() != null) {
//            addressDTO.setDistrictId(user.getDistrict().getId());
//            addressDTO.setDistrictName(user.getDistrict().getName());
//        }
//        if (user.getWard() != null) {
//            addressDTO.setWardId(user.getWard().getId());
//            addressDTO.setWardName(user.getWard().getName());
//        }
//        addressDTO.setStreet(user.getStreet());
//
//        dto.setAddress(addressDTO);
//        return dto;
//    }

    //  Cập nhật hồ sơ cá nhân
    public void updateProfile(Account account, AccountDTO dto) {
        // Luôn giữ nguyên role cũ, không cho phép đổi role qua updateProfile
        Role oldRole = account.getRole();
        modelMapper.map(dto, account);  // map ngược lại từ dto -> entity
        account.setRole(oldRole); // đảm bảo role không bị thay đổi
        authenticationReponsitory.save(account);
    }

    //  Đổi mật khẩu
//    public void changePassword(Account account, ChangePasswordDTO dto) {
//        if (!passwordEncoder.matches(dto.getOldPassword(), account.getPassword())) {
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu cũ không đúng");
//        }
//
//        account.setPassword(passwordEncoder.encode(dto.getNewPassword()));
//        accountRepository.save(account);
//    }

    // Đăng xuất (nếu cần)
    public void logout(Account account) {
        // Nếu dùng token blacklist / refresh token thì xử lý ở đây
    }

    public String getRoleById(Long userId) {
        Account acc = accountRepository.findById(userId).orElse(null);
        return acc != null ? acc.getRoleName() : null;
    }
    public long countAll() {
        return accountRepository.count();
    }
    public Long getIdByEmail(String email) {
        Account acc = accountRepository.findByEmail(email);
        return acc != null ? acc.getId() : null;
    }
    public Account getProfile(Long userId) {
        return accountRepository.findById(userId).orElse(null);
    }


        // 1. Lấy hồ sơ Customer

    // 2. Lịch sử hiến máu
    public List<DonationHistoryDTO> getDonationHistory(User user) {
        return donationHistoryRepository.findByCustomer(user).stream()
                .map(dh -> modelMapper.map(dh, DonationHistoryDTO.class))
                .collect(Collectors.toList());
    }


    // 3. Gợi ý ngày hiến máu tiếp theo
    public String getDonationRecommendation(User user) {
        LocalDate last = user.getLastDonationDate();
        if (last == null) return "Bạn chưa từng hiến máu. Bạn có thể hiến ngay hôm nay.";

        LocalDate next = last.plusDays(90);
        return next.isAfter(LocalDate.now())
                ? "Bạn có thể hiến máu lại vào ngày: " + next
                : "Bạn đã có thể hiến máu trở lại.";
    }


    // DTO trả về ngày sẵn sàng hiến máu
    public static class ReadyDateResponse {
        private String readyDate;
        public ReadyDateResponse(String readyDate) { this.readyDate = readyDate; }
        public String getReadyDate() { return readyDate; }
        public void setReadyDate(String readyDate) { this.readyDate = readyDate; }
    }
    public ReadyDateResponse getReadyDate(User user) {
        LocalDate last = user.getLastDonationDate();
        String date = (last == null)
                ? LocalDate.now().toString()
                : last.plusDays(90).toString();
        return new ReadyDateResponse(date);
    }


}
