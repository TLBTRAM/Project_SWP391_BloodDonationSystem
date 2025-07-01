package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.request.BloodRequestRequest;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.BloodRequest;
import com.swp.blooddonation.entity.Customer;
import com.swp.blooddonation.entity.Patient;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.BloodRequestRepository;
import com.swp.blooddonation.repository.CustomerRepository;
import com.swp.blooddonation.repository.PatientRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class BloodRequestService {
    @Autowired
    AuthenticationService authenticationService;
    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    BloodRequestRepository bloodRequestRepository;
    @Autowired
    PatientRepository patientRepository;

    @Transactional
    public BloodRequest requestBlood(BloodRequestRequest dto) {
        Account currentUser = authenticationService.getCurrentAccount();

        if (currentUser.getRole() != Role.CUSTOMER && currentUser.getRole() != Role.MEDICALSTAFF) {
            throw new BadRequestException("Only donor or medical staff can send blood requests.");
        }

        Patient patient;

        // Nếu có ID → tìm theo ID
        if (dto.getPatientId() != null) {
            patient = patientRepository.findById(dto.getPatientId())
                    .orElseThrow(() -> new BadRequestException("Patient not found."));
        } else {
            // Kiểm tra bệnh nhân đã tồn tại theo tên + ngày sinh
            patient = patientRepository.findByFullNameAndDateOfBirth(
                    dto.getPatientFullName(), dto.getPatientDateOfBirth()).orElse(null);

            if (patient == null) {
                // Tạo mới nếu chưa tồn tại
                patient = new Patient();
                patient.setFullName(dto.getPatientFullName());
                patient.setDateOfBirth(dto.getPatientDateOfBirth());
                patient.setAddress(dto.getPatientAddress());
                patient.setHospitalName(dto.getHospitalName());
                patient.setMedicalCondition(dto.getMedicalCondition());
                patient.setBloodType(dto.getBloodType());
                patient.setRhType(dto.getRhType());
                patientRepository.save(patient);
            }
        }

        // Tạo yêu cầu truyền máu
        BloodRequest request = new BloodRequest();
        request.setRequester(currentUser);
        request.setPatient(patient);
        request.setBloodType(dto.getBloodType());
        request.setRhType(dto.getRhType());
        request.setRequiredVolume(dto.getRequiredVolume());
        request.setHospitalName(dto.getHospitalName());
        request.setMedicalCondition(dto.getMedicalCondition());
        request.setRequestDate(LocalDate.now());
        request.setStatus("PENDING");

        return bloodRequestRepository.save(request);
    }

}

