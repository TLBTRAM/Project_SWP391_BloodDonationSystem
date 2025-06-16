package com.swp.blooddonation.service;


import com.swp.blooddonation.dto.UpdateRoleRequest;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.UserNotFoundException;
import com.swp.blooddonation.repository.AuthenticationReponsitory;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AuthenticationReponsitory authenticationReponsitory;
    private final TokenService tokenService;
    private final ModelMapper modelMapper;
//
//    //  Lấy danh sách tài khoản theo role
//    public List<AdminUserDTO> getUsersByRole(Role role) {
//        return accountRepository.findByRole(role).stream()
//                .map(account -> modelMapper.map(account, AdminUserDTO.class))
//                .collect(Collectors.toList());
//    }

//    //  Cập nhật role của người dùng
//    public void updateUserRole(Long userId, Role newRole) {
//        Account account = accountRepository.findById(userId)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
//        account.setRole(newRole);
//        accountRepository.save(account);
//    }
//
//    //  Kích hoạt / vô hiệu hóa tài khoản
//    public void updateUserStatus(Long userId, boolean enabled) {
//        Account account = accountRepository.findById(userId)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
//        account.setEnabled(enabled);
//        accountRepository.save(account);
//    }
//
//    //  Xóa tài khoản
//    public void deleteUser(Long userId) {
//        if (!accountRepository.existsById(userId)) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
//        }
//        accountRepository.deleteById(userId);
//    }

    public Map<String, Object> updateRole(UpdateRoleRequest request) {
        Account account = authenticationReponsitory.findById(request.getAccountId())
                .orElseThrow(() -> new UserNotFoundException("Không tìm thấy tài khoản"));

        if (request.getNewRole() == null) {
            throw new IllegalArgumentException("Vai trò mới không được để trống");
        }

        Role newRole;
        try {
             newRole = request.getNewRole();

        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Vai trò không hợp lệ: " + request.getNewRole());
        }

        account.setRole(newRole);
        authenticationReponsitory.save(account);

        String newToken = tokenService.generateToken(account);

        return Map.of(
                "message", "Cập nhật role thành công",
                "accountId", account.getId(),
                "newRole", account.getRole().name(),
                "newToken", newToken
        );
    }

}
