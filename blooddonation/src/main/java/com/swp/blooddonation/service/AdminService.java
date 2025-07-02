package com.swp.blooddonation.service;


import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.MedicalStaff;
import com.swp.blooddonation.entity.Customer;
import com.swp.blooddonation.entity.Manager;
import com.swp.blooddonation.enums.EnableStatus;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.UserNotFoundException;
import com.swp.blooddonation.repository.AccountRepository;
import com.swp.blooddonation.repository.MedicalStaffRepository;
import com.swp.blooddonation.repository.CustomerRepository;
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

    private final AccountRepository accountRepository;
    private final ModelMapper modelMapper;

    @Autowired
    MedicalStaffRepository medicalStaffRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    ManagerRepository managerRepository;

    //  Cập nhật role của người dùng
    public void updateUserRole(Long userId, Role newRole) {
        Account account = accountRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        Role oldRole = account.getRole(); // lưu role cũ (để xử lý nếu chuyển từ khác sang MEDICALSTAFF)

        // Ẩn (set active=false) bản ghi vai trò cũ nếu có
        if (oldRole == Role.MEDICALSTAFF) {
            medicalStaffRepository.findById(account.getId()).ifPresent(staff -> {
                staff.setActive(false);
                medicalStaffRepository.save(staff);
            });
        } else if (oldRole == Role.CUSTOMER) {
            customerRepository.findById(account.getId()).ifPresent(customer -> {
                customer.setActive(false);
                customerRepository.save(customer);
            });
        } else if (oldRole == Role.MANAGER) {
            // Giả sử có managerRepository
            managerRepository.findById(account.getId()).ifPresent(manager -> {
                manager.setActive(false);
                managerRepository.save(manager);
            });
        }

        account.setRole(newRole);
        accountRepository.save(account);

        // Hiện (set active=true) hoặc tạo mới bản ghi vai trò mới
        if (newRole == Role.MEDICALSTAFF) {
            MedicalStaff staff = medicalStaffRepository.findById(account.getId()).orElse(null);
            if (staff == null) {
                staff = new MedicalStaff();
                staff.setAccount(account);
                staff.setDepartment(null);
            }
            staff.setActive(true);
            medicalStaffRepository.save(staff);
        } else if (newRole == Role.CUSTOMER) {
            Customer customer = customerRepository.findById(account.getId()).orElse(null);
            if (customer == null) {
                customer = new Customer();
                customer.setAccount(account);
            }
            customer.setActive(true);
            customerRepository.save(customer);
        } else if (newRole == Role.MANAGER) {
            // Giả sử có managerRepository
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
