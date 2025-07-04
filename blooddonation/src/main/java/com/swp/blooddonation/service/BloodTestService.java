package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.response.BloodTestResponse;
import com.swp.blooddonation.dto.CompleteBloodTest;
import com.swp.blooddonation.entity.*;
import com.swp.blooddonation.enums.AppointmentEnum;
import com.swp.blooddonation.enums.BloodTestStatus;
import com.swp.blooddonation.enums.Role;

import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Service
public class BloodTestService {
    @Autowired
    private BloodTestRepository bloodTestRepository;

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    TestResultRepository testResultRepository;

    @Autowired
    MedicalStaffRepository medicalStaffRepository;

    @Autowired
    private AuthenticationService authenticationService;

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
        test.setStatus(request.isPassed() ? BloodTestStatus.COMPLETED : BloodTestStatus.FAILED);
        test.setBloodType(request.getBloodType());
        test.setMedicalStaff(appointment.getMedicalStaff());

        // Cập nhật nhóm máu cho người hiến nếu chưa có
        Customer donor = appointment.getCustomer().getCustomer();
        if (donor != null && donor.getBloodType() == null && request.getBloodType() != null) {
            donor.setBloodType(request.getBloodType());
            customerRepository.save(donor);
        }

        // Lưu kết quả xét nghiệm
        bloodTestRepository.save(test);

        // Nếu xét nghiệm đạt yêu cầu thì lưu vào TestResult
        if (request.isPassed()) {
            TestResult testResult = new TestResult();
            testResult.setTestDate(LocalDate.now());
            testResult.setBloodPressure(request.getBloodPressure());
            testResult.setHeartRate(request.getHeartRate());
            testResult.setResult(request.getResult());
            testResult.setType(request.getBloodType());
            testResult.setRhType(request.getRhType());
            testResult.setCustomer(donor);
            Account staffAccount = appointment.getMedicalStaff();
            MedicalStaff staff = medicalStaffRepository.findById(staffAccount.getId())
                    .orElseThrow(() -> new BadRequestException("Medical staff not found"));
            testResult.setStaff(staff);

            testResultRepository.save(testResult);
        }

        // Chuẩn bị dữ liệu phản hồi
        Account staff = appointment.getMedicalStaff();
        Long testedById = (staff != null) ? staff.getId() : null;
        String testedByName = (staff != null) ? staff.getFullName() : "Unknown";

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

        return response;
    }



}
