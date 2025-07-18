package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.AddressDTO;
import com.swp.blooddonation.dto.request.BloodRequestRequest;
import com.swp.blooddonation.dto.request.ComponentBloodRequestRequest;
import com.swp.blooddonation.dto.request.NotificationRequest;
import com.swp.blooddonation.entity.*;
import com.swp.blooddonation.enums.*;
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
    BloodComponentRepository bloodComponentRepository;

    @Autowired
    BloodRequestComponentRepository bloodRequestComponentRepository;

    @Autowired
    BloodUnitRepository bloodUnitRepository;

    @Autowired
    WholeBloodRequestRepository wholeBloodRequestRepository;

    @Autowired
    NotificationService notificationService;

    @Autowired
    UserService userService;


    @Transactional
    public WholeBloodRequest requestBlood(BloodRequestRequest dto) {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getAccount().getRole() != Role.CUSTOMER && currentUser.getAccount().getRole() != Role.MEDICALSTAFF) {
            throw new BadRequestException("Chỉ người dùng hoặc nhân viên y tế mới được gửi yêu cầu.");
        }


        // 1. Tạo WholeBloodRequest (chưa có patient)
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

        // 2. Map AddressDTO sang các trường riêng lẻ
        AddressDTO address = dto.getPatientAddress();

        // 3. Tạo bản ghi PendingPatientRequest
        PendingPatientRequest pending = PendingPatientRequest.builder()
                .fullName(dto.getFullName())
                .gender(dto.getGender())
                .dateOfBirth(dto.getDateOfBirth())
                .phone(dto.getPhone())
                .street(address.getStreet())
                .wardId(address.getWardId())
                .districtId(address.getDistrictId())
                .provinceId(address.getProvinceId())
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
    public void completeWholeBloodRequest(Long requestId) {
        WholeBloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy yêu cầu truyền máu."));

        if (request.getStatus() != BloodRequestStatus.READY) {
            throw new BadRequestException("Yêu cầu chưa sẵn sàng để hoàn thành.");
        }

        // Lấy danh sách các túi máu đã cấp cho yêu cầu này
        List<BloodUnit> units = bloodUnitRepository.findByWholeBloodRequest(request);

        if (units.isEmpty()) {
            throw new BadRequestException("Không có túi máu nào được gán cho yêu cầu này.");
        }

        for (BloodUnit unit : units) {
            unit.setStatus(BloodUnitStatus.USED);
            bloodUnitRepository.save(unit);
        }

        request.setStatus(BloodRequestStatus.COMPLETED);
        bloodRequestRepository.save(request);

        // Gửi thông báo
        notificationService.sendNotification(NotificationRequest.builder()
                .receiverIds(List.of(request.getRequester().getId()))
                .title("Yêu cầu truyền máu đã hoàn tất")
                .content("Yêu cầu truyền máu cho bệnh nhân " + request.getPatient().getFullName() + " đã được hoàn thành.")
                .type(NotificationType.BLOOD_REQUEST)
                .build());
    }

    @Transactional
    public void cancelWholeBloodRequest(Long requestId) {
        WholeBloodRequest request = wholeBloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy yêu cầu truyền máu."));

        User currentUser = userService.getCurrentUser();
        if (!request.getRequester().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Bạn không có quyền huỷ yêu cầu này.");
        }

        if (request.getStatus() != BloodRequestStatus.PENDING && request.getStatus() != BloodRequestStatus.READY) {
            throw new BadRequestException("Chỉ được huỷ yêu cầu đang chờ xử lý hoặc đã sẵn sàng.");
        }

        // Nếu có túi máu đã được gán thì thu hồi lại
        List<BloodUnit> assignedUnits = bloodUnitRepository.findByWholeBloodRequest(request);
        for (BloodUnit unit : assignedUnits) {
            unit.setWholeBloodRequest(null);
            unit.setStatus(BloodUnitStatus.COLLECTED);
            bloodUnitRepository.save(unit);
        }

        request.setStatus(BloodRequestStatus.CANCELLED);
        wholeBloodRequestRepository.save(request);

        pendingPatientRequestRepository.findByWholeBloodRequest(request).ifPresent(pending -> {
            pending.setStatus(BloodRequestStatus.CANCELLED);
            pendingPatientRequestRepository.save(pending);
        });

        notificationService.sendNotification(NotificationRequest.builder()
                .receiverIds(List.of(currentUser.getId()))
                .title("Yêu cầu truyền máu đã được huỷ")
                .content("Yêu cầu truyền máu của bạn đã bị huỷ thành công.")
                .type(NotificationType.BLOOD_REQUEST)
                .build());
    }



    @Transactional
    public void rejectWholeBloodRequest(Long requestId, String reason) {
        WholeBloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy yêu cầu truyền máu."));

        if (request.getStatus() != BloodRequestStatus.PENDING) {
            throw new BadRequestException("Chỉ được từ chối yêu cầu đang chờ xử lý.");
        }

        request.setStatus(BloodRequestStatus.REJECTED);
        bloodRequestRepository.save(request);

        // Cập nhật trạng thái pending patient (nếu có)
        pendingPatientRequestRepository.findByWholeBloodRequest(request).ifPresent(pending -> {
            pending.setStatus(BloodRequestStatus.REJECTED);
            pendingPatientRequestRepository.save(pending);
        });

        // Gửi thông báo từ chối
        notificationService.sendNotification(NotificationRequest.builder()
                .receiverIds(List.of(request.getRequester().getId()))
                .title("Yêu cầu truyền máu bị từ chối")
                .content("Yêu cầu truyền máu đã bị từ chối. Lý do: " + reason)
                .type(NotificationType.BLOOD_REQUEST)
                .build());
    }

    @Transactional
    public BloodRequestComponent requestBloodByComponent(ComponentBloodRequestRequest dto) {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getAccount().getRole() != Role.CUSTOMER && currentUser.getAccount().getRole() != Role.MEDICALSTAFF) {
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

        AddressDTO address = dto.getPatientAddress();

        // 2. Tạo bản ghi bệnh nhân tạm thời
        PendingPatientRequest pending = PendingPatientRequest.builder()
                .fullName(dto.getFullName())
                .gender(dto.getGender())
                .dateOfBirth(dto.getDateOfBirth())
                .phone(dto.getPhone())
                .street(address.getStreet())
                .wardId(address.getWardId())
                .districtId(address.getDistrictId())
                .provinceId(address.getProvinceId())
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
        patient.setStreet(pending.getStreet());
        patient.setWardId(pending.getWardId());
        patient.setDistrictId(pending.getDistrictId());
        patient.setProvinceId(pending.getProvinceId());
        patient.setBloodType(request.getBloodType());
        patient.setRhType(request.getRhType());
        patient.setHospitalName(request.getHospitalName());
        patient.setMedicalCondition(request.getMedicalCondition());
        patientRepository.save(patient);

        // Lấy danh sách túi máu phù hợp
        List<BloodUnit> availableUnits = bloodUnitRepository.findUsableBloodUnits(
                request.getBloodType(), request.getRhType());

        availableUnits.sort(Comparator.comparing(BloodUnit::getExpirationDate));

        List<BloodUnit> selectedUnits = new ArrayList<>();
        int accumulated = 0;
        int required = request.getRequiredVolume();

        for (BloodUnit unit : availableUnits) {
            selectedUnits.add(unit);
            accumulated += unit.getTotalVolume();
            if (accumulated >= required) break;
        }

        if (accumulated == 0) {
            throw new BadRequestException("Không tìm thấy đơn vị máu phù hợp.");
        }

        if (accumulated >= required) {
            // Đủ máu: cấp trực tiếp cho yêu cầu chính
            request.setPatient(patient);
            request.setStatus(BloodRequestStatus.READY);
            bloodRequestRepository.save(request);

            assignBloodUnitsToRequest(selectedUnits, request);

            notificationService.sendNotification(NotificationRequest.builder()
                    .receiverIds(List.of(request.getRequester().getId()))
                    .title("Yêu cầu truyền máu đã sẵn sàng")
                    .content("Yêu cầu truyền máu cho bệnh nhân " + patient.getFullName() + " đã được chuẩn bị đầy đủ.")
                    .type(NotificationType.BLOOD_REQUEST)
                    .build());

        } else {
            //  Không đủ máu: tạo yêu cầu mới cho phần đủ
            WholeBloodRequest readyPart = new WholeBloodRequest();
            readyPart.setBloodType(request.getBloodType());
            readyPart.setRhType(request.getRhType());
            readyPart.setRequiredVolume(accumulated);
            readyPart.setHospitalName(request.getHospitalName());
            readyPart.setMedicalCondition(request.getMedicalCondition());
            readyPart.setStatus(BloodRequestStatus.READY);
            readyPart.setPatient(patient);
            readyPart.setRequester(request.getRequester());
            readyPart.setRequestDate(LocalDate.now());
            wholeBloodRequestRepository.save(readyPart);

            assignBloodUnitsToRequest(selectedUnits, readyPart);

            // Cập nhật lại yêu cầu gốc
            request.setRequiredVolume(required - accumulated);
            request.setStatus(BloodRequestStatus.PENDING);
            bloodRequestRepository.save(request);

            notificationService.sendNotification(NotificationRequest.builder()
                    .receiverIds(List.of(request.getRequester().getId()))
                    .title("Yêu cầu truyền máu một phần")
                    .content("Yêu cầu truyền máu cho bệnh nhân " + patient.getFullName()
                            + " chỉ được đáp ứng một phần (" + accumulated + "ml). Cần bổ sung thêm " + (required - accumulated) + "ml.")
                    .type(NotificationType.BLOOD_REQUEST)
                    .build());
        }

        // Đánh dấu đã phê duyệt yêu cầu tạm thời
        pending.setStatus(BloodRequestStatus.APPROVED);
        pendingPatientRequestRepository.save(pending);
    }


    private void assignBloodUnitsToRequest(List<BloodUnit> units, WholeBloodRequest request) {
        for (BloodUnit unit : units) {
            unit.setStatus(BloodUnitStatus.RESERVED);
            unit.setWholeBloodRequest(request);
            bloodUnitRepository.save(unit);
        }
    }



    @Transactional
    public void approveComponentRequest(Long requestId) {
        BloodRequestComponent request = bloodRequestComponentRepository.findById(requestId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy yêu cầu truyền máu."));

        if (request.getStatus() != BloodRequestStatus.PENDING) {
            throw new BadRequestException("Yêu cầu đã được xử lý.");
        }

        // Lấy thông tin bệnh nhân tạm thời
        PendingPatientRequest pending = pendingPatientRequestRepository.findByBloodRequestComponent(request)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy thông tin bệnh nhân."));

        // Tạo bệnh nhân chính thức
        Patient patient = new Patient();
        patient.setFullName(pending.getFullName());
        patient.setDateOfBirth(pending.getDateOfBirth());
        patient.setStreet(pending.getStreet());
        patient.setWardId(pending.getWardId());
        patient.setDistrictId(pending.getDistrictId());
        patient.setProvinceId(pending.getProvinceId());
        patient.setBloodType(request.getBloodType());
        patient.setRhType(request.getRhType());
        patient.setHospitalName(request.getHospitalName());
        patient.setMedicalCondition(request.getMedicalCondition());
        patientRepository.save(patient);

        request.setPatient(patient);

        // Lưu trạng thái từng loại thành phần
        boolean redCellDone = false;
        boolean plasmaDone = false;
        boolean plateletDone = false;

        StringBuilder resultNote = new StringBuilder();

        // 1. HỒNG CẦU
        if (request.getRedCellQuantity() > 0) {
            redCellDone = processComponent(request, request.getBloodType(), request.getRhType(), ComponentType.RED_CELL,
                    request.getRedCellQuantity(), resultNote);
        } else redCellDone = true;

        // 2. HUYẾT TƯƠNG
        if (request.getPlasmaQuantity() > 0) {
            plasmaDone = processComponent(request, request.getBloodType(), request.getRhType(), ComponentType.PLASMA,
                    request.getPlasmaQuantity(), resultNote);
        } else plasmaDone = true;

        // 3. TIỂU CẦU
        if (request.getPlateletQuantity() > 0) {
            plateletDone = processComponent(request,request.getBloodType(), request.getRhType(), ComponentType.PLATELET,
                    request.getPlateletQuantity(), resultNote);
        } else plateletDone = true;

        if (redCellDone && plasmaDone && plateletDone) {
            request.setStatus(BloodRequestStatus.READY);
            bloodRequestComponentRepository.save(request);

            notificationService.sendNotification(NotificationRequest.builder()
                    .receiverIds(List.of(request.getRequester().getId()))
                    .title("Yêu cầu truyền máu đã sẵn sàng")
                    .content("Yêu cầu máu cho bệnh nhân " + patient.getFullName() + " đã được chuẩn bị đầy đủ.")
                    .type(NotificationType.BLOOD_REQUEST)
                    .build());
        } else {
            // Bổ sung: Nếu bất kỳ thành phần nào không đủ, trả về lỗi 400
            throw new BadRequestException("Không đủ thành phần máu trong kho để đáp ứng yêu cầu.\n" + resultNote.toString());
        }

        // Cập nhật trạng thái bệnh nhân tạm thời
        pending.setStatus(BloodRequestStatus.APPROVED);
        pendingPatientRequestRepository.save(pending);
    }



    private boolean processComponent(
            BloodRequestComponent requests,
            BloodType bloodType,
            RhType rhType,
            ComponentType componentType,
            int requiredVolume,
            StringBuilder note
    ) {
        List<BloodComponent> components = bloodComponentRepository
                .findByBloodTypeAndComponentTypeAndStatus(bloodType, componentType, ComponentStatus.AVAILABLE)
                .stream()
                .filter(c -> c.getRhType() == rhType)
                .sorted(Comparator.comparing(BloodComponent::getExpirationDate)) // Ưu tiên gần hết hạn
                .toList();

        int accumulated = 0;
        List<BloodComponent> selected = new ArrayList<>();

        for (BloodComponent component : components) {
            if (accumulated >= requiredVolume) break;
            if (component.getVolume() <= 0) continue;

            accumulated += component.getVolume();
            component.setStatus(ComponentStatus.RESERVED);
            component.setBloodRequestComponent(requests);

            selected.add(component);
            bloodComponentRepository.save(component);
        }

        if (accumulated >= requiredVolume) {
            note.append("- ").append(componentType.name()).append(": đã chuẩn bị ")
                    .append(accumulated).append("ml\n");
            return true;
        } else {
            note.append("- ").append(componentType.name()).append(": chỉ có ")
                    .append(accumulated).append("ml, cần thêm ")
                    .append(requiredVolume - accumulated).append("ml\n");
            return false;
        }
    }

    public List<WholeBloodRequest> getAllBloodRequests() {
        return wholeBloodRequestRepository.findAll();
    }

    @Transactional
    public void completeComponentBloodRequest(Long requestId) {
        BloodRequestComponent request = bloodRequestComponentRepository.findById(requestId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy yêu cầu truyền máu thành phần."));

        if (request.getStatus() != BloodRequestStatus.READY) {
            throw new BadRequestException("Yêu cầu chưa sẵn sàng để hoàn thành.");
        }

        // TODO: Nếu có logic cập nhật trạng thái các thành phần máu, thực hiện ở đây
        request.setStatus(BloodRequestStatus.COMPLETED);
        bloodRequestComponentRepository.save(request);

        // Gửi thông báo
        notificationService.sendNotification(NotificationRequest.builder()
                .receiverIds(List.of(request.getRequester().getId()))
                .title("Yêu cầu truyền máu thành phần đã hoàn tất")
                .content("Yêu cầu truyền máu thành phần cho bệnh nhân đã được hoàn thành.")
                .type(NotificationType.BLOOD_REQUEST)
                .build());
    }

    @Transactional
    public void rejectComponentBloodRequest(Long requestId, String reason) {
        BloodRequestComponent request = bloodRequestComponentRepository.findById(requestId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy yêu cầu truyền máu thành phần."));

        if (request.getStatus() != BloodRequestStatus.PENDING) {
            throw new BadRequestException("Chỉ được từ chối yêu cầu đang chờ xử lý.");
        }

        request.setStatus(BloodRequestStatus.REJECTED);
        bloodRequestComponentRepository.save(request);

        // Cập nhật trạng thái pending patient (nếu có)
        pendingPatientRequestRepository.findByBloodRequestComponent(request).ifPresent(pending -> {
            pending.setStatus(BloodRequestStatus.REJECTED);
            pendingPatientRequestRepository.save(pending);
        });

        // Gửi thông báo từ chối
        notificationService.sendNotification(NotificationRequest.builder()
                .receiverIds(List.of(request.getRequester().getId()))
                .title("Yêu cầu truyền máu thành phần bị từ chối")
                .content("Yêu cầu truyền máu thành phần đã bị từ chối. Lý do: " + reason)
                .type(NotificationType.BLOOD_REQUEST)
                .build());
    }

    @Transactional
    public void cancelRequestComponent(Long requestId) {
        System.out.println("----- BẮT ĐẦU HUỶ YÊU CẦU TRUYỀN MÁU THÀNH PHẦN -----");

        // Lấy yêu cầu
        BloodRequestComponent request = bloodRequestComponentRepository.findById(requestId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy yêu cầu."));

        System.out.println("ID yêu cầu: " + requestId);
        System.out.println("Trạng thái yêu cầu: " + request.getStatus());

        // Lấy người dùng hiện tại
        User currentUser = userService.getCurrentUser();
        System.out.println("Người dùng hiện tại ID: " + currentUser.getId());
        System.out.println("Người tạo yêu cầu ID: " + request.getRequester().getId());

        // Chỉ người tạo mới được huỷ
        if (!request.getRequester().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Bạn không có quyền huỷ yêu cầu này.");
        }

        // Chỉ huỷ nếu trạng thái là PENDING hoặc READY
        if (request.getStatus() != BloodRequestStatus.PENDING &&
                request.getStatus() != BloodRequestStatus.READY) {
            throw new BadRequestException("Chỉ được huỷ yêu cầu đang chờ xử lý hoặc đã sẵn sàng.");
        }

        // Tìm các thành phần máu đã liên kết
        List<BloodComponent> linkedComponents = bloodComponentRepository
                .findByBloodRequestComponent(request);

        System.out.println("Số lượng thành phần máu liên kết: " + linkedComponents.size());

        for (BloodComponent component : linkedComponents) {
            System.out.println("  - [Trước] Component ID: " + component.getId()
                    + " | Status: " + component.getStatus()
                    + " | Request ID: " + (component.getBloodRequestComponent() != null ? component.getBloodRequestComponent().getId() : "null"));

            // Cập nhật trạng thái và huỷ liên kết
            component.setStatus(ComponentStatus.AVAILABLE);
            component.setBloodRequestComponent(null);
            bloodComponentRepository.save(component);

            // Kiểm tra lại sau khi save
            BloodComponent updated = bloodComponentRepository.findById(component.getId()).orElse(null);
            if (updated != null) {
                System.out.println("  - [Sau]    Component ID: " + updated.getId()
                        + " | Status: " + updated.getStatus()
                        + " | Request ID: " + (updated.getBloodRequestComponent() != null ? updated.getBloodRequestComponent().getId() : "null"));
            }
        }

        // Cập nhật trạng thái yêu cầu
        request.setStatus(BloodRequestStatus.CANCELLED);
        bloodRequestComponentRepository.save(request);
        System.out.println("Đã cập nhật trạng thái yêu cầu thành CANCELLED");

        // Gửi thông báo
        notificationService.sendNotification(NotificationRequest.builder()
                .receiverIds(List.of(currentUser.getId()))
                .title("Yêu cầu truyền máu thành phần đã được huỷ")
                .content("Yêu cầu truyền máu thành phần của bạn đã bị huỷ thành công.")
                .type(NotificationType.BLOOD_REQUEST)
                .build());

        System.out.println("----- HUỶ YÊU CẦU THÀNH CÔNG -----");
    }


}
