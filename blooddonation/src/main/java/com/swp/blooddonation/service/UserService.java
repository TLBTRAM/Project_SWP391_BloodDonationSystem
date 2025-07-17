package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.CustomerDTO;
import com.swp.blooddonation.dto.DonationHistoryDTO;
import com.swp.blooddonation.dto.MedicalStaffDTO;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.User;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.UserNotFoundException;
import com.swp.blooddonation.repository.AuthenticationReponsitory;
import com.swp.blooddonation.repository.UserRepository;
import com.swp.blooddonation.repository.DonationHistoryRepository;
import jakarta.persistence.Access;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DonationHistoryRepository donationHistoryRepository;
    private final ModelMapper modelMapper;


    @Autowired
    AuthenticationReponsitory authenticationReponsitory;
    // 1. Lấy hồ sơ User
    public CustomerDTO getProfile() {
        User user = getCurrentUser();
        CustomerDTO dto = new CustomerDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setBirthDate(user.getBirthDate());
        dto.setLastDonationDate(user.getLastDonationDate());
        dto.setPhone(user.getPhone());

        // Set email từ Account
        if (user.getAccount() != null) {
            dto.setEmail(user.getAccount().getEmail());
        }

        // Set BloodType và RhType
        dto.setBloodType(user.getBloodType());
        dto.setRhType(user.getRhType());

        // Ghép địa chỉ
        StringBuilder addressBuilder = new StringBuilder();
        if (user.getStreet() != null) addressBuilder.append(user.getStreet()).append(", ");
        if (user.getWard() != null) addressBuilder.append(user.getWard().getName()).append(", ");
        if (user.getDistrict() != null) addressBuilder.append(user.getDistrict().getName()).append(", ");
        if (user.getProvince() != null) addressBuilder.append(user.getProvince().getName());

        dto.setAddress(addressBuilder.toString());

        return dto;
    }


    // 2. Lịch sử hiến máu (chỉ cho CUSTOMER)
//    public List<DonationHistoryDTO> getDonationHistory() {
//        User user = getCurrentUser();
////        if (user.getAccount().getRole() != Role.CUSTOMER) {
////            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ customer mới có thể xem lịch sử hiến máu");
////        }
//        return donationHistoryRepository.findByCustomerOrderByDonationDateDesc(user).stream()
//                .map(dh -> modelMapper.map(dh, DonationHistoryDTO.class))
//                .collect(Collectors.toList());
//    }

    public List<DonationHistoryDTO> getDonationHistory() {
    User user = getCurrentUser();

    return donationHistoryRepository.findByCustomerOrderByDonationDateDesc(user).stream()
            .map(dh -> {
                DonationHistoryDTO dto = modelMapper.map(dh, DonationHistoryDTO.class);
                dto.setDonorName(dh.getCustomer().getFullName());
                return dto;
            })
            .collect(Collectors.toList());
}

    // 3. Gợi ý ngày hiến máu tiếp theo (chỉ cho CUSTOMER)
    public String getDonationRecommendation(Account account) {
        User user = getUser(account);
        if (account.getRole() != Role.CUSTOMER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ customer mới có thể xem gợi ý hiến máu");
        }
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

    public ReadyDateResponse getReadyDate(Account account) {
        User user = getUser(account);
        if (account.getRole() != Role.CUSTOMER) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ customer mới có thể xem ngày sẵn sàng hiến máu");
        }
        LocalDate last = user.getLastDonationDate();
        String date;
        if (last == null) date = LocalDate.now().toString();
        else date = last.plusDays(90).toString();
        return new ReadyDateResponse(date);
    }

    // 4. Lấy thông tin Medical Staff
    public MedicalStaffDTO getMedicalStaffProfile(Account account) {
        User user = getUser(account);
        if (account.getRole() != Role.MEDICALSTAFF) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ medical staff mới có thể xem thông tin này");
        }
        MedicalStaffDTO dto = modelMapper.map(user, MedicalStaffDTO.class);
        dto.setFullName(user.getFullName());
        dto.setEmail(account.getEmail());
        dto.setPhone(user.getPhone());
        return dto;
    }

    // 5. Lấy User theo Account
    public User getUser(Account account) {
        return userRepository.findByAccount(account)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bạn chưa đăng ký thông tin cá nhân"));
    }

    // 6. Lấy User theo ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    // 7. Lấy tất cả Customer
    public List<User> getAllCustomers() {
        return userRepository.findAllCustomers();
    }

    // 8. Lấy tất cả Medical Staff
    public List<User> getAllMedicalStaff() {
        return userRepository.findAllMedicalStaff();
    }

    // 9. Lấy tất cả Manager
    public List<User> getAllManagers() {
        return userRepository.findAllManagers();
    }

    // 10. Lấy User theo Role
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRole(role);
    }

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("🔍 Đang lấy thông tin người dùng cho email: " + email);

        Account account = authenticationReponsitory.findAccountByEmail(email);

        if (account == null) {
            throw new UserNotFoundException("❌ Không tìm thấy tài khoản với email: " + email);
        }

        System.out.println("✅ Tìm thấy Account. ID: " + account.getId());
        System.out.println("⚙️ Account Role: " + account.getRole());

        User user = account.getUser();

        if (user == null) {
            System.out.println("❌ Không tìm thấy User gắn với Account ID: " + account.getId());
            throw new UserNotFoundException("Không tìm thấy người dùng gắn với tài khoản: " + email);
        }

        System.out.println("✅ Tìm thấy User. ID: " + user.getId());
        return user;
    }

} 