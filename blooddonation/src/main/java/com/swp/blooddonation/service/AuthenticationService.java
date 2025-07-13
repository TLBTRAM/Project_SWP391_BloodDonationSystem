package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.*;
import com.swp.blooddonation.dto.request.LoginRequest;
import com.swp.blooddonation.dto.request.RegisRequest;
import com.swp.blooddonation.dto.request.ResetPasswordRequest;
import com.swp.blooddonation.dto.response.AccountResponse;
import com.swp.blooddonation.dto.response.RegisterAccountResponse;
import com.swp.blooddonation.dto.response.RegisterResponse;
import com.swp.blooddonation.entity.*;
import com.swp.blooddonation.enums.EnableStatus;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.AuthenticationException;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.exception.exceptions.ResetPasswordException;
import com.swp.blooddonation.exception.exceptions.UserNotFoundException;
import com.swp.blooddonation.repository.*;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    @Autowired
    UserRepository userRepository;


    @Autowired
    ProvinceRepository provinceRepository;

    @Autowired
    DistrictRepository districtRepository;

    @Autowired

    WardRepository wardRepository;

    public RegisterAccountResponse register(@Valid RegisRequest regisRequest) {
        System.out.println("===== DEBUG REGISTER REQUEST =====");
        System.out.println("Received: " + regisRequest.getFullName());
        System.out.println("YoB: " + regisRequest.getBirthDate());
        System.out.println("Gender: " + regisRequest.getGender());
        System.out.println("Email: " + regisRequest.getEmail());
        System.out.println("Phone: " + regisRequest.getPhone());
        System.out.println("==================================");

        // Kiểm tra email đã tồn tại chưa
        if (authenticationReponsitory.existsByEmail(regisRequest.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng!");
        }

        // Mã hoá mật khẩu
        String encodedPassword = passwordEncoder.encode(regisRequest.getPassword());

        // Tạo đối tượng Account (chỉ chứa thông tin authentication)
        Account account = new Account();
        account.setEmail(regisRequest.getEmail());
        account.setPassword(encodedPassword);
        account.setCreatedAt(LocalDateTime.now());
        account.setEnableStatus(EnableStatus.ENABLE);
        account.setRole(Role.CUSTOMER);

        // Lấy thông tin địa chỉ hành chính từ DTO
        AddressDTO dto = regisRequest.getAddress();
        Province province = provinceRepository.findById(dto.getProvinceId())
                .orElseThrow(() -> new BadRequestException("Tỉnh/Thành không tồn tại"));

        District district = districtRepository.findById(dto.getDistrictId())
                .orElseThrow(() -> new BadRequestException("Quận/Huyện không tồn tại"));

        Ward ward = wardRepository.findById(dto.getWardId())
                .orElseThrow(() -> new BadRequestException("Phường/Xã không tồn tại"));

        // Lưu tài khoản vào DB
//        Account savedAccount = authenticationReponsitory.save(account);

        // Tạo User cho tất cả role
        User user = new User();
        user.setAccount(account);
        account.setUser(user);

        // Set personal info từ regisRequest
        user.setFullName(regisRequest.getFullName());
        user.setPhone(regisRequest.getPhone());
        user.setBirthDate(regisRequest.getBirthDate());
        user.setGender(regisRequest.getGender());
        user.setProvince(province);
        user.setDistrict(district);
        user.setWard(ward);
        user.setStreet(dto.getStreet());

        User savedUser = userRepository.save(user);
        Account savedAccount = savedUser.getAccount();



        // Gửi email chào mừng
        EmailDetail emailDetail = new EmailDetail();
        emailDetail.setMailRecipient(savedAccount.getEmail());
        emailDetail.setSubject("Welcome to Blood Donation Website");
        emailService.sendMailRegister(emailDetail);

        // Tạo phản hồi
        RegisterAccountResponse response = new RegisterAccountResponse();
        response.setId(savedAccount.getId());
        response.setEmail(savedAccount.getEmail());
        response.setPhone(regisRequest.getPhone());
        response.setFullName(regisRequest.getFullName());
        response.setGender(regisRequest.getGender());
        response.setBirthDate(regisRequest.getBirthDate());
        response.setEnabled(savedAccount.isEnabled());
        response.setCreatedAt(savedAccount.getCreatedAt());

        String fullAddress = String.join(", ",
                dto.getStreet(),
                ward.getName(),
                district.getName(),
                province.getName()
        );
        response.setFullAddress(fullAddress);

        return response;
    }


    public AccountResponse login(LoginRequest loginRequest){
        Account acc = authenticationReponsitory.findAccountByEmail(loginRequest.getEmail());
        if (acc == null) {
            throw new AuthenticationException("Email không tồn tại");
        }

        // In kiểm tra nhanh tại đây
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
            System.out.println("Thông tin đăng nhập không chính xác!!!!!!!!");
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
        
        // Kiểm tra xem có mã cũ chưa hết hạn không
        Optional<VerificationCode> existingCode = verificationCodeRepository.findTopByEmailOrderByExpiresAtDesc(email);
        if (existingCode.isPresent() && existingCode.get().getExpiresAt().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Mã xác minh trước đó vẫn còn hiệu lực. Vui lòng kiểm tra email hoặc đợi 10 phút.");
        }
        
        // Xóa mã cũ (nếu có)
        verificationCodeRepository.deleteByEmail(email);
        
        // Tạo mã 6 số ngẫu nhiên
        String code = String.format("%06d", new java.util.Random().nextInt(999999));
        VerificationCode vc = new VerificationCode(email, code, LocalDateTime.now().plusMinutes(10));
        verificationCodeRepository.save(vc);

        // Gửi email
        emailService.sendEmailCode(email, "Mã xác minh đặt lại mật khẩu", "Mã xác minh của bạn là: " + code);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest resetPasswordRequest) {
        // Validate input
        if (resetPasswordRequest.getEmail() == null || resetPasswordRequest.getEmail().trim().isEmpty()) {
            throw new ResetPasswordException("Email không được để trống");
        }
        if (resetPasswordRequest.getCode() == null || resetPasswordRequest.getCode().trim().isEmpty()) {
            throw new ResetPasswordException("Mã xác minh không được để trống");
        }
        if (resetPasswordRequest.getNewPassword() == null || resetPasswordRequest.getNewPassword().trim().isEmpty()) {
            throw new ResetPasswordException("Mật khẩu mới không được để trống");
        }
        if (resetPasswordRequest.getNewPassword().length() < 6) {
            throw new ResetPasswordException("Mật khẩu phải có ít nhất 6 ký tự");
        }

        // Tìm mã xác minh
        VerificationCode vc = verificationCodeRepository.findTopByEmailOrderByExpiresAtDesc(resetPasswordRequest.getEmail())
                .orElseThrow(() -> new ResetPasswordException("Không tìm thấy mã xác minh"));

        // Kiểm tra mã
        if (!vc.getCode().equals(resetPasswordRequest.getCode())) {
            throw new ResetPasswordException("Mã không chính xác");
        }
        
        // Kiểm tra hết hạn
        if (vc.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResetPasswordException("Mã đã hết hạn");
        }

        // Tìm tài khoản
        Account account = authenticationReponsitory.findAccountByEmail(resetPasswordRequest.getEmail());
        if (account == null) {
            throw new ResetPasswordException("Người dùng không tồn tại");
        }

        // Cập nhật mật khẩu
        account.setPassword(passwordEncoder.encode(resetPasswordRequest.getNewPassword()));
        authenticationReponsitory.save(account);
        
        // Xóa mã xác minh đã sử dụng
        verificationCodeRepository.deleteByEmail(resetPasswordRequest.getEmail());
    }

//
//    public Account getCurrentAccount(){
//        String email = SecurityContextHolder.getContext().getAuthentication().getName();
////        return authenticationReponsitory.findAccountByEmail(email).orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));
//        Account account = authenticationReponsitory.findAccountByEmail(email);
//        if (account == null) {
//            throw new UserNotFoundException("User not found with email: " + email);
//        }
//        return account;
//    }

    public List<MedicalStaffDTO> getMedicalStaff() {
        List<Account> medicalStaffAccounts = authenticationReponsitory.findByRole(Role.MEDICALSTAFF);
        return medicalStaffAccounts.stream()
                .map(account -> modelMapper.map(account, MedicalStaffDTO.class))
                .collect(Collectors.toList());
    }
}
