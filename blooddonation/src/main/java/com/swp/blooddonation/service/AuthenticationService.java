package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.*;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.VerificationCode;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.AuthenticationException;
import com.swp.blooddonation.exception.exceptions.ResetPasswordException;
import com.swp.blooddonation.repository.AuthenticationReponsitory;
import com.swp.blooddonation.repository.VerificationCodeRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthenticationService implements UserDetailsService {
    @Autowired
    AuthenticationReponsitory authenticationReponsitory;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    TokenService tokenService;

    @Autowired
    @Lazy
    AuthenticationManager authenticationManager;

    @Autowired
    EmailService emailService;

    public RegisterResponse register(@Valid RegisRequest regisRequest) {
        if (authenticationReponsitory.existsByEmail(regisRequest.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // Mã hoá mật khẩu
        regisRequest.setPassword(passwordEncoder.encode(regisRequest.getPassword()));

        // Map từ RegisRequest sang Account
        Account account = modelMapper.map(regisRequest, Account.class);
        account.setCreateAt(LocalDateTime.now());
        account.setEnabled(true);
        account.setRole(Role.Donor);

        // Lưu vào DB
        Account savedAccount = authenticationReponsitory.save(account);

        // Gửi email
        EmailDetail emailDetail = new EmailDetail();
        emailDetail.setMailRecipient(savedAccount.getEmail());
        emailDetail.setSubject("Welcome to Blood Donation Website");
        emailService.sendMailRegister(emailDetail);

        // Map từ Account sang RegisterResponse
        RegisterResponse registerResponse = modelMapper.map(savedAccount, RegisterResponse.class);

        return registerResponse;
    }



    public AccountResponse login(LoginRequest loginRequest){
        Account acc = authenticationReponsitory.findAccountByEmail(loginRequest.getEmail());
        if (acc == null) {
            throw new AuthenticationException("Email không tồn tại");
        }

        // ✅ In kiểm tra nhanh tại đây
        System.out.println("=== DEBUG PASSWORD MATCHING ===");
        System.out.println("Raw password: " + loginRequest.getPassword());
        System.out.println("Encoded in DB: " + acc.getPassword());
        System.out.println("Password match? " + passwordEncoder.matches(loginRequest.getPassword(), acc.getPassword()));
        System.out.println("================================");

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()

            ));
            System.out.println("Thông tin đăng nhập chính xác");
        }catch (Exception e){
            System.out.println("Thông tin đăng nhập không chính xác");
            e.printStackTrace();
            throw new AuthenticationException("invalid...");
        }


        Account account = authenticationReponsitory.findAccountByEmail(loginRequest.getEmail());
        AccountResponse accountResponse = modelMapper.map(account, AccountResponse.class);
        String token = tokenService.generateToken(account);
        accountResponse.setToken(token);
        return accountResponse;
    }



//    public User changePassword(ChangePassswordRequest changePassswordRequest){
//
//        User user = authenticationReponsitory.findAccountByEmail(changePassswordRequest.getEmail());
//        if(user == null){
//            return "User is not found";
//        }
//        if(!user.getPassword().equals(changePassswordRequest.getPassword())){
//            return "Incorrect password";
//        }
//        user.setPassword((changePassswordRequest.getNewPassword()));
//        authenticationReponsitory.save(user);
//        return "Password changed successfully";
//    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Account account = authenticationReponsitory.findAccountByEmail(email);
        if (account == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return account;
    }


    @Autowired
    VerificationCodeRepository verificationCodeRepository;

    public void sendResetCode(String email) {
        Account account = authenticationReponsitory.findAccountByEmail(email);
        if (account == null) throw new RuntimeException("Email không tồn tại");
        // Xóa mã cũ (nếu có)
        verificationCodeRepository.deleteByEmail(email);
        String code = String.format("%06d", new java.util.Random().nextInt(999999));
        VerificationCode vc = new VerificationCode(email, code, LocalDateTime.now().plusMinutes(10));
        verificationCodeRepository.save(vc);

        emailService.sendEmailCode(email, "Mã xác minh đặt lại mật khẩu", "Mã xác minh của bạn là: " + code);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest resetPasswordRequest) {
        VerificationCode vc = verificationCodeRepository.findTopByEmailOrderByExpiresAtDesc(resetPasswordRequest.getEmail())
                .orElseThrow(() -> new ResetPasswordException("Không tìm thấy mã xác minh"));

        if (!vc.getCode().equals(resetPasswordRequest.getCode())) throw new ResetPasswordException("Mã không chính xác");
        if (vc.getExpiresAt().isBefore(LocalDateTime.now())) throw new ResetPasswordException("Mã đã hết hạn");

        Account account = authenticationReponsitory.findAccountByEmail(resetPasswordRequest.getEmail());
        if (account == null) throw new ResetPasswordException("Người dùng không tồn tại");

        account.setPassword(passwordEncoder.encode(resetPasswordRequest.getNewPassword()));
        authenticationReponsitory.save(account);
        verificationCodeRepository.deleteByEmail(resetPasswordRequest.getEmail());
    }
}
