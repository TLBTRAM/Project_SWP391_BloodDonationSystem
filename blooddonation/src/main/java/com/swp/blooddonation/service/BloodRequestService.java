package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.request.BloodRequestRequest;
import com.swp.blooddonation.dto.request.ComponentBloodRequestRequest;
import com.swp.blooddonation.dto.request.ComponentRequestDTO;
import com.swp.blooddonation.entity.*;
import com.swp.blooddonation.enums.BloodRequestStatus;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BloodRequestService {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private BloodRequestRepository bloodRequestRepository;

    @Autowired
    private PendingPatientRequestRepository pendingPatientRequestRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    BloodRequestComponentRepository bloodRequestComponentRepository;

    @Transactional
    public WholeBloodRequest requestBlood(BloodRequestRequest dto) {
        Account currentUser = authenticationService.getCurrentAccount();

        if (currentUser.getRole() != Role.CUSTOMER && currentUser.getRole() != Role.MEDICALSTAFF) {
            throw new BadRequestException("Chỉ người dùng hoặc nhân viên y tế mới được gửi yêu cầu.");
        }

        // 1. Tạo BloodRequest (chưa có patient)
        WholeBloodRequest request = new WholeBloodRequest();
        request.setRequester(currentUser);
        request.setBloodType(dto.getBloodType());
        request.setRhType(dto.getRhType());
        request.setRequiredVolume(dto.getRequiredVolume());
        request.setHospitalName(dto.getHospitalName());
        request.setMedicalCondition(dto.getMedicalCondition());
        request.setRequestDate(LocalDate.now());
        request.setStatus(BloodRequestStatus.PENDING);
        bloodRequestRepository.save(request);

        // 2. Tạo bản ghi PendingPatientRequest
        PendingPatientRequest pending = PendingPatientRequest.builder()
                .fullName(dto.getFullName())
                .gender(dto.getGender())
                .dateOfBirth(dto.getDateOfBirth())
                .phone(dto.getPhone())
                .address(dto.getPatientAddress())
                .email(null)
                .bloodType(dto.getBloodType().name())
                .status(BloodRequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .wholeBloodRequest(request)
                .build();
        pendingPatientRequestRepository.save(pending);

        return request;
    }

    @Transactional
    public BloodRequestComponent requestBloodByComponent(ComponentBloodRequestRequest dto) {
        Account currentUser = authenticationService.getCurrentAccount();

        if (currentUser.getRole() != Role.CUSTOMER && currentUser.getRole() != Role.MEDICALSTAFF) {
            throw new BadRequestException("Chỉ người dùng hoặc nhân viên y tế mới được gửi yêu cầu.");
        }

        // 1. Tạo yêu cầu truyền máu thành phần
        BloodRequestComponent request = new BloodRequestComponent();
        request.setRequester(currentUser);
        request.setBloodType(dto.getBloodType());
        request.setRhType(dto.getRhType());
        request.setHospitalName(dto.getHospitalName());
        request.setMedicalCondition(dto.getMedicalCondition());
        request.setRequestDate(LocalDateTime.now());
        request.setStatus(BloodRequestStatus.PENDING);
        request.setRedCellQuantity(dto.getRedCellQuantity());
        request.setPlasmaQuantity(dto.getPlasmaQuantity());
        request.setPlateletQuantity(dto.getPlateletQuantity());

        bloodRequestComponentRepository.save(request);

        // 2. Tạo bản ghi bệnh nhân tạm thời
        PendingPatientRequest pending = PendingPatientRequest.builder()
                .fullName(dto.getFullName())
                .gender(dto.getGender())
                .dateOfBirth(dto.getDateOfBirth())
                .phone(dto.getPhone())
                .address(dto.getPatientAddress())
                .email(null)
                .bloodType(dto.getBloodType().name())
                .status(BloodRequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .wholeBloodRequest(null) // vì đang dùng theo Component
                .bloodRequestComponent(request)
                .build();

        pendingPatientRequestRepository.save(pending);

        return request;
    }




    @Transactional
    public void approveBloodRequest(Long requestId) {
        WholeBloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy yêu cầu truyền máu."));

        if (request.getStatus() != BloodRequestStatus.PENDING) {
            throw new BadRequestException("Yêu cầu đã được xử lý.");
        }

        // 1. Lấy thông tin bệnh nhân tạm thời
        PendingPatientRequest pending = pendingPatientRequestRepository.findByWholeBloodRequest(request)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy thông tin bệnh nhân."));

        // 2. Tạo bệnh nhân chính thức
        Patient patient = new Patient();
        patient.setFullName(pending.getFullName());
        patient.setDateOfBirth(pending.getDateOfBirth());
        patient.setAddress(pending.getAddress());
        patient.setBloodType(request.getBloodType());
        patient.setRhType(request.getRhType());
        patient.setHospitalName(request.getHospitalName());
        patient.setMedicalCondition(request.getMedicalCondition());

        patientRepository.save(patient);

        // 3. Gán bệnh nhân vào yêu cầu máu
        request.setPatient(patient);
        request.setStatus(BloodRequestStatus.APPROVED);
        bloodRequestRepository.save(request);

        // 4. Cập nhật trạng thái pending
        pending.setStatus(BloodRequestStatus.APPROVED);
        pendingPatientRequestRepository.save(pending);
    }
}
