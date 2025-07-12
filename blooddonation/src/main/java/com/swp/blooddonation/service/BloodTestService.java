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

import com.swp.blooddonation.dto.request.NotificationRequest;

@Service
public class BloodTestService {
    @Autowired
    private BloodTestRepository bloodTestRepository;

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    AccountRepository accountRepository;
    @Autowired
    TestResultRepository testResultRepository;

    @Autowired
    MedicalStaffRepository medicalStaffRepository;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public BloodTest createBloodTest(Long customerId) {
        Account currentUser = authenticationService.getCurrentAccount();

        if (!currentUser.getRole().equals(Role.MEDICALSTAFF)) {
            throw new BadRequestException("Only medical staff can create blood tests");
        }

        LocalDate today = LocalDate.now();

        Appointment appointment = appointmentRepository
                .findByCustomer_IdAndAppointmentDateAndStatus(customerId, today, AppointmentEnum.SCHEDULED)
                .orElseThrow(() -> new BadRequestException("No scheduled appointment found for this customer today"));
        //Kiểm tra đúng MedicalStaff
        if (appointment.getMedicalStaff() == null || appointment.getMedicalStaff().getId() != currentUser.getId()) {
            throw new BadRequestException("Bạn không có quyền tạo xét nghiệm cho cuộc hẹn này");
        }

        if (bloodTestRepository.findByAppointment(appointment).isPresent()) {
            throw new BadRequestException("Blood test already exists for this appointment");
        }

        BloodTest bloodTest = new BloodTest();
        bloodTest.setAppointment(appointment);
        bloodTest.setStatus(BloodTestStatus.PENDING);
        bloodTest.setCreatedAt(LocalDateTime.now());
        bloodTest.setMedicalStaff(currentUser);

        return bloodTestRepository.save(bloodTest);
    }


    @Transactional
    public BloodTest startBloodTest(Long id) {
        Account currentUser = authenticationService.getCurrentAccount();

        BloodTest test = bloodTestRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Blood test not found"));
        Appointment appointment = test.getAppointment();
        if (appointment == null || appointment.getMedicalStaff() == null) {
            throw new BadRequestException("Appointment or Medical Staff not found for this blood test");
        }

        // Kiểm tra quyền thực hiện
        if (appointment.getMedicalStaff().getId() != currentUser.getId()) {
            throw new BadRequestException("Bạn không có quyền thực hiện xét nghiệm này");
        }

        test.setStatus(BloodTestStatus.IN_PROGRESS);
        return bloodTestRepository.save(test);
    }
    @Transactional
    public BloodTestResponse completeBloodTest(Long testId, CompleteBloodTest request) {
        Account currentUser = authenticationService.getCurrentAccount();

        BloodTest test = bloodTestRepository.findById(testId)
                .orElseThrow(() -> new BadRequestException("Blood test not found"));

        Appointment appointment = test.getAppointment();
        if (appointment == null) {
            throw new BadRequestException("Appointment not found for this blood test");
        }

        if (appointment.getMedicalStaff().getId() != currentUser.getId()) {
            throw new BadRequestException("Bạn không có quyền hoàn tất xét nghiệm này");
        }

        // Cập nhật thông tin xét nghiệm
        test.setResult(request.getResult());
        test.setStatus(BloodTestStatus.COMPLETED);
        test.setBloodType(request.getBloodType());
        test.setRhType(request.getRhType());
        test.setMedicalStaff(appointment.getMedicalStaff());

        // Cập nhật nhóm máu cho người hiến nếu chưa có
        Account account = appointment.getCustomer();
        if (account != null && account.getBloodType() == null && request.getBloodType() != null) {
            account.setBloodType(request.getBloodType());
            account.setRhType(request.getRhType());
            accountRepository.save(account);
        }

        // Lưu kết quả xét nghiệm
        bloodTestRepository.save(test);

        // Luôn lưu TestResult dù passed là false
        TestResult testResult = new TestResult();
        testResult.setTestDate(LocalDate.now());
        testResult.setBloodPressure(request.getBloodPressure());
        testResult.setHeartRate(request.getHeartRate());
        testResult.setResult(request.getResult());
        testResult.setType(request.getBloodType());
        testResult.setRhType(request.getRhType());
        testResult.setCustomer(account);
        testResult.setPassed(request.isPassed());
        testResult.setBloodTest(test);

        Account staffAccount = appointment.getMedicalStaff();
        MedicalStaff staff = medicalStaffRepository.findById(staffAccount.getId())
                .orElseThrow(() -> new BadRequestException("Medical staff not found"));
        testResult.setStaff(staff);

        testResultRepository.save(testResult);

        // Chuẩn bị phản hồi
        Long testedById = (staffAccount != null) ? staffAccount.getId() : null;
        String testedByName = (staffAccount != null) ? staffAccount.getFullName() : "Unknown";
        LocalDate testDate = appointment.getAppointmentDate();

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

        // Gửi thông báo kết quả xét nghiệm
        if (account != null ) {
            String content = "Kết quả xét nghiệm của bạn cho cuộc hẹn ngày " + testDate + ": " + request.getResult();
            content += request.isPassed() ? ". Bạn đủ điều kiện hiến máu." : ". Bạn chưa đủ điều kiện hiến máu.";

            NotificationRequest notiRequest = NotificationRequest.builder()
                    .receiverIds(List.of(account.getId()))
                    .title("Kết quả xét nghiệm máu")
                    .content(content)
                    .type(NotificationType.TEST_RESULT)
                    .build();

            notificationService.sendNotification(notiRequest);
        }

        return response;
    }


}
