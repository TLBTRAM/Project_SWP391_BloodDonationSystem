package com.swp.blooddonation.service;

import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.Appointment;
import com.swp.blooddonation.entity.BloodTest;
import com.swp.blooddonation.enums.AppointmentEnum;
import com.swp.blooddonation.enums.BloodTestStatus;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.AppointmentRepository;
import com.swp.blooddonation.repository.BloodTestRepository;
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
    public BloodTest completeBloodTest(Long id, String result, boolean passed)  {
        BloodTest test = bloodTestRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Blood test not found"));
        test.setResult(result);
        test.setStatus(passed ? BloodTestStatus.COMPLETED : BloodTestStatus.FAILED);
        return bloodTestRepository.save(test);
    }
}
