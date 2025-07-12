package com.swp.blooddonation.service;


import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.MedicalStaff;
//import com.swp.blooddonation.entity.Customer;
import com.swp.blooddonation.entity.Manager;
import com.swp.blooddonation.enums.EnableStatus;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.UserNotFoundException;
import com.swp.blooddonation.repository.AccountRepository;
import com.swp.blooddonation.repository.MedicalStaffRepository;
//import com.swp.blooddonation.repository.CustomerRepository;
import com.swp.blooddonation.repository.ManagerRepository;
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

    private final ModelMapper modelMapper;

    @Autowired
    MedicalStaffRepository medicalStaffRepository;

//    @Autowired
//    CustomerRepository customerRepository;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    ManagerRepository managerRepository;

    //  Cập nhật role của người dùng
    public void updateUserRole(Long userId, Role newRole) {
        Account account = accountRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        Role oldRole = account.getRole(); // Lưu role cũ

        // Nếu role cũ là MEDICALSTAFF thì ẩn bản ghi medicalStaff
        if (oldRole == Role.MEDICALSTAFF) {
            medicalStaffRepository.findById(account.getId()).ifPresent(staff -> {
                staff.setActive(false);
                medicalStaffRepository.save(staff);
            });
        } else if (oldRole == Role.MANAGER) {
            managerRepository.findById(account.getId()).ifPresent(manager -> {
                manager.setActive(false);
                managerRepository.save(manager);
            });
        }

        // Cập nhật role mới
        account.setRole(newRole);
        accountRepository.save(account);

        // Tạo hoặc hiển bản ghi mới cho các role yêu cầu bảng riêng
        if (newRole == Role.MEDICALSTAFF) {
            MedicalStaff staff = medicalStaffRepository.findById(account.getId()).orElse(null);
            if (staff == null) {
                staff = new MedicalStaff();
                staff.setAccount(account);
                staff.setDepartment(null); // Có thể bổ sung sau
            }
            staff.setActive(true);
            medicalStaffRepository.save(staff);
        } else if (newRole == Role.MANAGER) {
            Manager manager = managerRepository.findById(account.getId()).orElse(null);
            if (manager == null) {
                manager = new Manager();
                manager.setAccount(account);
            }
            manager.setActive(true);
            managerRepository.save(manager);
        }

    }


    //  Kích hoạt / vô hiệu hóa tài khoản
    public void updateUserStatus(Long userId, boolean enabled) {
        Account account = accountRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        account.setEnableStatus(enabled ? EnableStatus.ENABLE : EnableStatus.DISABLE);
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
