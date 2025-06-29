package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.AccountDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.repository.AccountRepository;
import com.swp.blooddonation.repository.AuthenticationReponsitory;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountService {

//    private final AccountRepository accountRepository;
    @Autowired
    AuthenticationReponsitory authenticationReponsitory;


    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;



    // ✅ Trả về thông tin tài khoản hiện tại
    public AccountDTO getProfile(Account account) {
        return modelMapper.map(account, AccountDTO.class);
    }

    //  Cập nhật hồ sơ cá nhân
    public void updateProfile(Account account, AccountDTO dto) {
        // Cập nhật các field từ DTO sang entity bằng modelMapper
        modelMapper.map(dto, account);  // map ngược lại từ dto -> entity
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

    // ✅ Đăng xuất (nếu cần)
    public void logout(Account account) {
        // Nếu dùng token blacklist / refresh token thì xử lý ở đây
    }
}
