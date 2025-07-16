
package com.swp.blooddonation.service;


import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.User;
import com.swp.blooddonation.enums.EnableStatus;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.UserNotFoundException;
import com.swp.blooddonation.repository.AccountRepository;
import com.swp.blooddonation.repository.UserRepository;
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
    UserRepository userRepository;

    //  Cập nhật role của người dùng
    public void updateUserRole(Long userId, Role newRole) {
        Account account = accountRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        Role oldRole = account.getRole(); // lưu role cũ

        // Cập nhật role trong Account
        account.setRole(newRole);
        accountRepository.save(account);

        // Tạo hoặc cập nhật User nếu cần
        User user = userRepository.findById(account.getId()).orElse(null);
        if (user == null) {
            user = new User();
            user.setAccount(account);
            userRepository.save(user);
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

    // Lấy danh sách user theo Role
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    // Lấy tất cả user
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
