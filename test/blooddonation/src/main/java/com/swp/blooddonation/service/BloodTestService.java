package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.response.BloodTestResponse;
import com.swp.blooddonation.dto.CompleteBloodTest;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.Appointment;
import com.swp.blooddonation.entity.BloodTest;
import com.swp.blooddonation.entity.Customer;
import com.swp.blooddonation.enums.AppointmentEnum;
import com.swp.blooddonation.enums.BloodTestStatus;
import com.swp.blooddonation.enums.Role;

import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.AppointmentRepository;
import com.swp.blooddonation.repository.BloodTestRepository;
import com.swp.blooddonation.repository.CustomerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class BloodTestService {
    @Autowired
    private BloodTestRepository bloodTestRepository;

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    CustomerRepository customerRepository;


    @Autowired
    private AuthenticationService authenticationService;

    @Transactional
    public BloodTest createBloodTest(Long customerId) {
        Account account = authenticationService.getCurrentAccount();
        if(!account.getRole().equals(Role.MEDICALSTAFF)) {
            throw new BadRequestException("Only medical staff can create blood tests");
        }
        LocalDate today = LocalDate.now();
        Appointment appointment = appointmentRepository.findByCustomer_IdAndAppointmentDateAndStatus(customerId, today, AppointmentEnum.APPROVED)
                .orElseThrow(() -> new BadRequestException("No confirmed appointment found for the given date"));

        if(bloodTestRepository.findByAppointment(appointment).isPresent()){
            throw new BadRequestException("Blood test already exists for this appointment");
        }
        BloodTest bloodTest = new BloodTest();
        bloodTest.setAppointment(appointment);
        bloodTest.setStatus(BloodTestStatus.PENDING);
        bloodTest.setCreatedAt(LocalDate.now());
        return bloodTestRepository.save(bloodTest);
    }


    @Transactional
    public BloodTest startBloodTest(Long id) {
        BloodTest test = bloodTestRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Blood test not found"));
        test.setStatus(BloodTestStatus.IN_PROGRESS);
        return bloodTestRepository.save(test);
    }

    @Transactional
    public BloodTestResponse completeBloodTest(Long testId, CompleteBloodTest request) {
        BloodTest test = bloodTestRepository.findById(testId)
                .orElseThrow(() -> new BadRequestException("Blood test not found"));

        Appointment appointment = test.getAppointment();
        if (appointment == null) {
            throw new BadRequestException("Appointment not found for this blood test");
        }
        test.setResult(request.getResult());
        test.setStatus(request.isPassed() ? BloodTestStatus.COMPLETED : BloodTestStatus.FAILED);
        test.setBloodType(request.getBloodType()); // Gán bloodType vào bản ghi xét nghiệm
        test.setMedicalStaff(appointment.getMedicalStaff());




        Customer donor = appointment.getCustomer().getCustomer();
        if (donor != null && donor.getBloodType() == null && request.getBloodType() != null) {
            donor.setBloodType(request.getBloodType());
            customerRepository.save(donor);
        }


        Account staff = appointment.getMedicalStaff();
        Long testedById = (staff != null) ? staff.getId() : null;
        String testedByName = (staff != null) ? staff.getFullName() : "Unknown";

        LocalDate testDate = appointment.getAppointmentDate();

        bloodTestRepository.save(test);

        BloodTestResponse response = new BloodTestResponse();
        response.setId(test.getId());
        response.setResult(test.getResult());
        response.setPassed(request.isPassed());
        response.setStatus(test.getStatus());
        response.setBloodType(request.getBloodType()); // hoặc lấy từ test.getBloodType()
        response.setTestDate(testDate);
        response.setTestedById(testedById);
        response.setTestedByName(testedByName); // nhớ thêm trường này trong DTO

        return response;
    }


}
