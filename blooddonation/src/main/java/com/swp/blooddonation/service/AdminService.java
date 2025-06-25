package com.swp.blooddonation.service;


import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.enums.EnableStatus;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.UserNotFoundException;
import com.swp.blooddonation.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
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

    //  Cập nhật role của người dùng
    public void updateUserRole(Long userId, Role newRole) {
        Account account = accountRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        account.setRole(newRole);
        accountRepository.save(account);
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
