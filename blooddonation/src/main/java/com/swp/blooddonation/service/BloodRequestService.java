package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.request.BloodRequestRequest;
import com.swp.blooddonation.dto.request.ComponentBloodRequestRequest;
import com.swp.blooddonation.dto.request.NotificationRequest;
import com.swp.blooddonation.entity.*;
import com.swp.blooddonation.enums.BloodRequestStatus;
import com.swp.blooddonation.enums.BloodUnitStatus;
import com.swp.blooddonation.enums.NotificationType;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BloodRequestService {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private WholeBloodRequestRepository bloodRequestRepository;

    @Autowired
    private PendingPatientRequestRepository pendingPatientRequestRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    BloodRequestComponentRepository bloodRequestComponentRepository;

    @Autowired
    BloodUnitRepository bloodUnitRepository;

    @Autowired
    WholeBloodRequestRepository wholeBloodRequestRepository;

    @Autowired
    NotificationService notificationService;

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

        // Lấy thông tin bệnh nhân tạm thời
        PendingPatientRequest pending = pendingPatientRequestRepository.findByWholeBloodRequest(request)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy thông tin bệnh nhân."));

        // Tạo bệnh nhân chính thức
        Patient patient = new Patient();
        patient.setFullName(pending.getFullName());
        patient.setDateOfBirth(pending.getDateOfBirth());
        patient.setAddress(pending.getAddress());
        patient.setBloodType(request.getBloodType());
        patient.setRhType(request.getRhType());
        patient.setHospitalName(request.getHospitalName());
        patient.setMedicalCondition(request.getMedicalCondition());
        patientRepository.save(patient);

        // Tìm máu đủ điều kiện
        int totalRequired = request.getRequiredVolume();
        List<BloodUnit> availableUnits = bloodUnitRepository.findUsableBloodUnits(
                request.getBloodType(), request.getRhType());
        availableUnits.sort(Comparator.comparing(BloodUnit::getExpirationDate));

        int accumulated = 0;
        List<BloodUnit> selectedUnits = new ArrayList<>();
        for (BloodUnit unit : availableUnits) {
            if (accumulated >= totalRequired) break;
            accumulated += unit.getTotalVolume();
            selectedUnits.add(unit);
        }

        if (accumulated == 0) {
            throw new BadRequestException("Không tìm thấy đơn vị máu phù hợp.");
        }

        // Gán máu cho bản gốc luôn, không tạo mới nếu đủ
        for (BloodUnit unit : selectedUnits) {
            unit.setStatus(BloodUnitStatus.RESERVED);
            bloodUnitRepository.save(unit);
        }

        request.setPatient(patient);

        if (accumulated >= totalRequired) {
            //  ĐỦ: Cập nhật trạng thái sang READY
            request.setStatus(BloodRequestStatus.READY);
            bloodRequestRepository.save(request);

            notificationService.sendNotification(NotificationRequest.builder()
                    .receiverIds(List.of(request.getRequester().getId()))
                    .title("Yêu cầu truyền máu đã sẵn sàng")
                    .content("Yêu cầu truyền máu cho bệnh nhân " + patient.getFullName() + " đã được chuẩn bị đầy đủ.")
                    .type(NotificationType.BLOOD_REQUEST)
                    .build());
        } else {
            //  KHÔNG ĐỦ: cập nhật bản gốc còn lại, tạo bản mới với phần đủ
            int remaining = totalRequired - accumulated;

            // 1. Tạo yêu cầu mới với phần đủ
            WholeBloodRequest readyPart = new WholeBloodRequest();
            readyPart.setBloodType(request.getBloodType());
            readyPart.setRhType(request.getRhType());
            readyPart.setRequiredVolume(accumulated);
            readyPart.setHospitalName(request.getHospitalName());
            readyPart.setMedicalCondition(request.getMedicalCondition());
            readyPart.setStatus(BloodRequestStatus.READY);
            readyPart.setPatient(patient);
            readyPart.setRequester(request.getRequester());
            readyPart.setRequestDate(LocalDate.now()); // bạn nên đặt ngày mới
            wholeBloodRequestRepository.save(readyPart);

            // 2. Cập nhật yêu cầu gốc còn lại
            request.setRequiredVolume(remaining);
            request.setStatus(BloodRequestStatus.PENDING);
            bloodRequestRepository.save(request);

            notificationService.sendNotification(NotificationRequest.builder()
                    .receiverIds(List.of(request.getRequester().getId()))
                    .title("Yêu cầu truyền máu một phần")
                    .content("Yêu cầu truyền máu cho bệnh nhân " + patient.getFullName()
                            + " chỉ được đáp ứng một phần (" + accumulated + "ml). Cần bổ sung thêm " + remaining + "ml.")
                    .type(NotificationType.BLOOD_REQUEST)
                    .build());
        }

        // Cập nhật trạng thái bệnh nhân tạm thời
        pending.setStatus(BloodRequestStatus.APPROVED);
        pendingPatientRequestRepository.save(pending);
    }




}
