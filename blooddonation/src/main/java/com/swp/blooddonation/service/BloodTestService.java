package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.response.BloodTestResponse;
import com.swp.blooddonation.dto.CompleteBloodTest;
import com.swp.blooddonation.entity.*;
import com.swp.blooddonation.enums.AppointmentEnum;
import com.swp.blooddonation.enums.BloodTestStatus;
import com.swp.blooddonation.enums.NotificationType;
import com.swp.blooddonation.enums.Role;

import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.swp.blooddonation.dto.request.NotificationRequest;

@Service
public class BloodTestService {
    @Autowired
    private BloodTestRepository bloodTestRepository;

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TestResultRepository testResultRepository;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    UserService userService;

    @Autowired
    RegisterRepository registerRepository;

    @Transactional
    public BloodTest createBloodTest(Long registerId) {
        User currentUser = userService.getCurrentUser();
        if (!currentUser.getAccount().getRole().equals(Role.MEDICALSTAFF)) {
            throw new BadRequestException("Only medical staff can create blood tests");
        }
        if (currentUser == null) {
            throw new BadRequestException("User profile not found for the current account.");
        }
        Register register = registerRepository.findById(registerId)
                .orElseThrow(() -> new BadRequestException("Register not found"));
        if (register.getStatus() == null || !register.getStatus().name().equals("APPROVED")) {
            throw new BadRequestException("Chỉ được tạo xét nghiệm cho đơn đăng ký đã được duyệt (APPROVED)");
        }
        if (bloodTestRepository.findByRegister(register).isPresent()) {
            throw new BadRequestException("Blood test already exists for this register");
        }
        BloodTest bloodTest = new BloodTest();
        bloodTest.setRegister(register);
        bloodTest.setStatus(BloodTestStatus.PENDING);
        bloodTest.setCreatedAt(LocalDateTime.now());
        bloodTest.setMedicalStaff(currentUser);
        return bloodTestRepository.save(bloodTest);
    }


    @Transactional
    public BloodTestResponse completeBloodTest(Long testId, CompleteBloodTest request) {
        User currentUser = userService.getCurrentUser();
        if (currentUser == null) {
            throw new BadRequestException("User profile not found for current account.");
        }
        BloodTest test = bloodTestRepository.findById(testId)
                .orElseThrow(() -> new BadRequestException("Blood test not found"));
        Register register = test.getRegister();
        if (register == null) {
            throw new BadRequestException("Register not found for this blood test");
        }
        if (register.getStatus() == null || !register.getStatus().name().equals("APPROVED")) {
            throw new BadRequestException("Chỉ được nhập kết quả cho đơn đăng ký đã được duyệt (APPROVED)");
        }
        // Cập nhật thông tin xét nghiệm
        test.setResult(request.getResult());
        test.setStatus(BloodTestStatus.COMPLETED);
        test.setBloodType(request.getBloodType());
        test.setRhType(request.getRhType());
        test.setMedicalStaff(currentUser);
        // Cập nhật nhóm máu cho người hiến nếu chưa có
        User donor = register.getUser();
        if (donor != null && donor.getBloodType() == null && request.getBloodType() != null) {
            donor.setBloodType(request.getBloodType());
            userRepository.save(donor);
        }
        bloodTestRepository.save(test);
        LocalDate testDate = register.getRegisterDate();
        User staffUser = currentUser;
        Long testedById = (staffUser != null) ? staffUser.getId() : null;
        String testedByName = (staffUser != null) ? staffUser.getFullName() : "Unknown";
        if (request.isPassed()) {
            if (testResultRepository.findByBloodTest(test).isPresent()) {
                throw new BadRequestException("Đã tồn tại kết quả xét nghiệm cho blood test này!");
            }
            TestResult testResult = new TestResult();
            testResult.setTestDate(LocalDate.now());
            testResult.setBloodPressure(request.getBloodPressure());
            testResult.setHeartRate(request.getHeartRate());
            testResult.setResult(request.getResult());
            testResult.setType(request.getBloodType());
            testResult.setRhType(request.getRhType());
            testResult.setCustomer(donor);
            testResult.setPassed(true);
            testResult.setBloodTest(test);
            testResult.setStaff(staffUser);
            testResultRepository.save(testResult);
        }
        if (donor != null) {
            String content = "Kết quả xét nghiệm của bạn cho đơn đăng ký ngày " + testDate + ": " + request.getResult();
            content += request.isPassed() ? ". Bạn đủ điều kiện hiến máu." : ". Bạn chưa đủ điều kiện hiến máu.";
            NotificationRequest notiRequest = NotificationRequest.builder()
                    .receiverIds(List.of(donor.getAccount().getId()))
                    .title("Kết quả xét nghiệm máu")
                    .content(content)
                    .type(NotificationType.TEST_RESULT)
                    .build();
            notificationService.sendNotification(notiRequest);
        }
        BloodTestResponse response = new BloodTestResponse();
        response.setId(test.getId());
        response.setResult(test.getResult());
        response.setPassed(request.isPassed());
        response.setStatus(test.getStatus());
        response.setBloodType(request.getBloodType());
        response.setRhType(request.getRhType());
        response.setTestDate(testDate);
        response.setTestedById(testedById);
        response.setTestedByName(testedByName);
        return response;
    }

    @Transactional
    public BloodTestResponse completeBloodTestByRegister(Long registerId, CompleteBloodTest request) {
        User currentUser = userService.getCurrentUser();
        if (currentUser == null) {
            throw new BadRequestException("User profile not found for current account.");
        }
        // Tìm register và kiểm tra trạng thái APPROVED
        Register register = registerRepository.findById(registerId)
                .orElseThrow(() -> new BadRequestException("Register not found"));
        if (register.getStatus() == null || !register.getStatus().name().equals("APPROVED")) {
            throw new BadRequestException("Chỉ được nhập kết quả cho đơn đăng ký đã được duyệt (APPROVED)");
        }
        // Tìm bloodTest theo register, nếu chưa có thì tạo mới
        BloodTest test = bloodTestRepository.findByRegister(register)
                .orElseGet(() -> {
                    BloodTest newTest = new BloodTest();
                    newTest.setRegister(register);
                    newTest.setStatus(BloodTestStatus.PENDING);
                    newTest.setCreatedAt(LocalDateTime.now());
                    newTest.setMedicalStaff(currentUser);
                    return bloodTestRepository.save(newTest);
                });
        // Cập nhật thông tin xét nghiệm
        test.setResult(request.getResult());
        test.setStatus(BloodTestStatus.COMPLETED);
        test.setBloodType(request.getBloodType());
        test.setRhType(request.getRhType());
        test.setMedicalStaff(currentUser);
        // Cập nhật nhóm máu cho người hiến nếu chưa có
        User donor = register.getUser();
        if (donor != null && donor.getBloodType() == null && request.getBloodType() != null) {
            donor.setBloodType(request.getBloodType());
            userRepository.save(donor);
        }
        bloodTestRepository.save(test);
        LocalDate testDate = register.getRegisterDate();
        User staffUser = currentUser;
        Long testedById = (staffUser != null) ? staffUser.getId() : null;
        String testedByName = (staffUser != null) ? staffUser.getFullName() : "Unknown";
        if (request.isPassed()) {
            // Kiểm tra đã có test result cho blood test này chưa
            if (testResultRepository.findByBloodTest(test).isPresent()) {
                throw new BadRequestException("Đã tồn tại kết quả xét nghiệm cho blood test này!");
            }
            // Tạo test result
            TestResult testResult = new TestResult();
            testResult.setTestDate(LocalDate.now());
            testResult.setBloodPressure(request.getBloodPressure());
            testResult.setHeartRate(request.getHeartRate());
            testResult.setResult(request.getResult());
            testResult.setType(request.getBloodType());
            testResult.setRhType(request.getRhType());
            testResult.setCustomer(donor);
            testResult.setPassed(true);
            testResult.setBloodTest(test);
            testResult.setStaff(staffUser);
            testResultRepository.save(testResult);
        }
        // Gửi thông báo cho người hiến
        if (donor != null) {
            String content = "Kết quả xét nghiệm của bạn cho đơn đăng ký ngày " + testDate + ": " + request.getResult();
            content += request.isPassed() ? ". Bạn đủ điều kiện hiến máu." : ". Bạn chưa đủ điều kiện hiến máu.";
            NotificationRequest notiRequest = NotificationRequest.builder()
                    .receiverIds(List.of(donor.getAccount().getId()))
                    .title("Kết quả xét nghiệm máu")
                    .content(content)
                    .type(NotificationType.TEST_RESULT)
                    .build();
            notificationService.sendNotification(notiRequest);
        }
        // Chuẩn bị response
        BloodTestResponse response = new BloodTestResponse();
        response.setId(test.getId());
        response.setResult(test.getResult());
        response.setPassed(request.isPassed());
        response.setStatus(test.getStatus());
        response.setBloodType(request.getBloodType());
        response.setRhType(request.getRhType());
        response.setTestDate(testDate);
        response.setTestedById(testedById);
        response.setTestedByName(testedByName);
        return response;
    }

    public java.util.List<BloodTestResponse> getAllCompletedBloodTests() {
        return bloodTestRepository.findAllByStatus(BloodTestStatus.COMPLETED)
            .stream()
            .map(test -> {
                BloodTestResponse response = new BloodTestResponse();
                response.setId(test.getId());
                response.setResult(test.getResult());
                response.setStatus(test.getStatus());
                response.setBloodType(test.getBloodType());
                response.setRhType(test.getRhType());
                response.setTestDate(test.getRegister() != null ? test.getRegister().getRegisterDate() : null);
                response.setTestedById(test.getMedicalStaff() != null ? test.getMedicalStaff().getId() : null);
                response.setTestedByName(test.getMedicalStaff() != null ? test.getMedicalStaff().getFullName() : null);
                // Nếu có TestResult thì lấy passed từ đó, nếu không thì null
                response.setPassed(false); // Nếu muốn để null thì cần sửa BloodTestResponse thành Boolean
                // Bổ sung thông tin người hiến máu
                if (test.getRegister() != null && test.getRegister().getUser() != null) {
                    response.setCustomerId(test.getRegister().getUser().getId());
                    response.setCustomerName(test.getRegister().getUser().getFullName());
                }
                return response;
            })
            .collect(Collectors.toList());
    }
}
