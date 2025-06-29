package com.swp.blooddonation.service;


import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.MedicalStaff;
import com.swp.blooddonation.enums.EnableStatus;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.UserNotFoundException;
import com.swp.blooddonation.repository.AccountRepository;
import com.swp.blooddonation.repository.MedicalStaffRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AccountRepository accountRepository;
    private final ModelMapper modelMapper;

    @Autowired
    MedicalStaffRepository medicalStaffRepository;

    //  Cập nhật role của người dùng
    public void updateUserRole(Long userId, Role newRole) {
        Account account = accountRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        Role oldRole = account.getRole(); // lưu role cũ (để xử lý nếu chuyển từ khác sang MEDICALSTAFF)
        account.setRole(newRole);
        accountRepository.save(account);

        // Nếu cập nhật sang MEDICALSTAFF và chưa có bản ghi MedicalStaff thì tạo mới
        if (newRole == Role.MEDICALSTAFF && !medicalStaffRepository.existsById(account.getId())) {
            MedicalStaff staff = new MedicalStaff();
            staff.setAccount(account);
            staff.setDepartment("Default"); // hoặc lấy từ input khác nếu có
            medicalStaffRepository.save(staff);
        }

        // (Tuỳ chọn) Nếu chuyển từ MEDICALSTAFF sang role khác => có thể xoá MedicalStaff nếu cần
        if (oldRole == Role.MEDICALSTAFF && newRole != Role.MEDICALSTAFF) {
            medicalStaffRepository.findById(account.getId())
                    .ifPresent(medicalStaffRepository::delete);
        }
    }

    //  Kích hoạt / vô hiệu hóa tài khoản
    public void updateUserStatus(Long userId, boolean enabled) {
        Account account = accountRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        account.setEnableStatus(EnableStatus.ENABLE);
        accountRepository.save(account);
    }

    //  Xóa tài khoản
    public void deleteUser(Long userId) {
        if (!accountRepository.existsById(userId)) {
            throw new UserNotFoundException("User not found with ID: " + userId);
        }
        accountRepository.deleteById(userId);
    }
}
