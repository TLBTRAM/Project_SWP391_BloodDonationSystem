package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.AccountResponse;
import com.swp.blooddonation.dto.EmailDetail;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.VerificationCode;
import com.swp.blooddonation.exception.exceptions.AuthenticationException;
import com.swp.blooddonation.exception.exceptions.ResetPasswordException;
import com.swp.blooddonation.model.LoginRequest;
import com.swp.blooddonation.model.ResetPasswordRequest;
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

    public Account register (@Valid Account account){
        if (authenticationReponsitory.existsByEmail(account.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }
        account.setPassword(passwordEncoder.encode((account.getPassword())));
        Account newAccount = authenticationReponsitory.save(account);

        // send email
        EmailDetail emailDetail = new EmailDetail();
        emailDetail.setMailRecipient(account.email);
        emailDetail.setSubject("Welcome to Blood Donation Website");
        emailService.sendMail(emailDetail);

        return newAccount;
    }


    public AccountResponse login(LoginRequest loginRequest){
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
            ));
        }catch (Exception e){
            System.out.println("Thông tin dằng nhập không chính xác");
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
        return authenticationReponsitory.findAccountByEmail(email);
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

        emailService.sendEmail(email, "Mã xác minh đặt lại mật khẩu", "Mã xác minh của bạn là: " + code);
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
