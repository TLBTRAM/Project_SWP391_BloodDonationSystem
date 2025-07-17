package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.request.BloodComponentVolumeRequest;
import com.swp.blooddonation.dto.request.CollectBloodRequest;
import com.swp.blooddonation.entity.*;
import com.swp.blooddonation.entity.DonationHistory;
import com.swp.blooddonation.enums.*;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.swp.blooddonation.dto.request.NotificationRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.Optional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.swp.blooddonation.dto.response.BloodUnitSimpleResponse;
import com.swp.blooddonation.repository.BloodComponentRepository;
import com.swp.blooddonation.entity.BloodComponent;
import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class BloodUnitService {
    private final BloodUnitRepository bloodUnitRepository;

    private final BloodTestRepository bloodTestRepository;

    private final AuthenticationService authenticationService;



    private final UserRepository userRepository;

    private final BloodComponentRepository bloodComponentRepository;

    private final NotificationService notificationService;

    private final AccountRepository accountRepository;
    private final TestResultRepository testResultRepository;

    private final DonationHistoryRepository donationHistoryRepository;
    private final UserService userService;


    @Transactional
    public BloodUnit collectBlood(CollectBloodRequest request) {
        User currentUser = userService.getCurrentUser();

        if (!currentUser.getAccount().getRole().equals(Role.MEDICALSTAFF)) {
            throw new BadRequestException("Only medical staff can collect blood.");
        }

        // Lấy kết quả xét nghiệm
        BloodTest test = bloodTestRepository.findById(request.getTestId())
                .orElseThrow(() -> new BadRequestException("Blood test not found"));

        if (test.getStatus() != BloodTestStatus.COMPLETED) {
            throw new BadRequestException("Blood test must be completed first.");
        }

        TestResult testResult = testResultRepository.findByBloodTest(test)
                .orElseThrow(() -> new BadRequestException("Test result not found for this test."));

        if (!testResult.isPassed()) {
            throw new BadRequestException("Cannot collect blood: test result did not pass.");
        }


        // Lấy người hiến từ register
        User donor = test.getRegister().getUser();

        // Validate thể tích
        if (request.getTotalVolume() <= 0 || request.getTotalVolume() > 500) {
            throw new BadRequestException("Total volume must be between 1 and 500 ml.");
        }

        // Cập nhật ngày hiến máu cuối cùng cho người hiến
        donor.setLastDonationDate(LocalDate.now());
        userRepository.save(donor);

        // Tạo bản ghi lịch sử hiến máu
        DonationHistory donationHistory = new DonationHistory();
        donationHistory.setDonationDate(LocalDateTime.now());
        donationHistory.setVolume(request.getTotalVolume());
        donationHistory.setCustomer(donor);
        donationHistory.setLocation("Blood Donation Center");
        donationHistory.setNotes("Blood collected by " + currentUser.getFullName());
        donationHistoryRepository.save(donationHistory);

        // Tạo BloodUnit
        BloodUnit unit = new BloodUnit();
        unit.setBloodType(request.getBloodType());
        unit.setRhType(request.getRhType());
        unit.setTotalVolume(request.getTotalVolume());
        unit.setCollectedDate(LocalDate.now());
        unit.setExpirationDate(LocalDate.now().plusDays(42)); // Hạn dùng máu toàn phần: 42 ngày
        unit.setDonor(donor);
        unit.setCollectedBy(currentUser);
        unit.setStatus(BloodUnitStatus.COLLECTED);

        return bloodUnitRepository.save(unit);
    }



    @Transactional
    public BloodUnit separateBlood(Long unitId, BloodComponentVolumeRequest request) {
        BloodUnit unit = bloodUnitRepository.findById(unitId)
                .orElseThrow(() -> new BadRequestException("Blood unit not found"));

        if (unit.getStatus() != BloodUnitStatus.COLLECTED) {
            throw new BadRequestException("Blood unit already separated or expired.");
        }

        int total = request.getRedCellVolume() + request.getPlasmaVolume() + request.getPlateletVolume();
        if (total > unit.getTotalVolume()) {
            throw new BadRequestException("Total component volume exceeds collected blood volume.");
        }

        List<BloodComponent> components = new ArrayList<>();

        if (request.getRedCellVolume() > 0) {
            components.add(createComponent(ComponentType.RED_CELL, request.getRedCellVolume(), unit, 42));
        }

        if (request.getPlasmaVolume() > 0) {
            components.add(createComponent(ComponentType.PLASMA, request.getPlasmaVolume(), unit, 365));
        }

        if (request.getPlateletVolume() > 0) {
            components.add(createComponent(ComponentType.PLATELET, request.getPlateletVolume(), unit, 5));
        }

        bloodComponentRepository.saveAll(components);

        unit.setStatus(BloodUnitStatus.SEPARATED);
        return bloodUnitRepository.save(unit);
    }

    private BloodComponent createComponent(ComponentType type, int volume, BloodUnit unit, int daysToExpire) {
        BloodComponent component = new BloodComponent();
        component.setComponentType(type);
        component.setVolume(volume);
        component.setBloodType(unit.getBloodType());
        component.setRhType(unit.getRhType());
        component.setCollectedDate(LocalDate.now());
        component.setExpirationDate(LocalDate.now().plusDays(daysToExpire));
        component.setStatus(ComponentStatus.AVAILABLE);
        component.setFromBloodUnit(unit);
        return component;
    }

    @Transactional
    public BloodUnit addManualBloodUnit(BloodType bloodType, RhType rhType, int totalVolume, LocalDate collectedDate, LocalDate expirationDate) {
        BloodUnit unit = new BloodUnit();
        unit.setBloodType(bloodType);
        unit.setRhType(rhType);
        unit.setTotalVolume(totalVolume);
        unit.setCollectedDate(collectedDate);
        unit.setExpirationDate(expirationDate);
        unit.setStatus(BloodUnitStatus.COLLECTED);
        // Không set donor, collectedBy
        return bloodUnitRepository.save(unit);
    }

    public void checkAndNotifyLowBloodVolume() {
        Integer total = bloodUnitRepository.getTotalUsableVolume();
        if (total == null) total = 0;
        if (total < 2000) {
            // Lấy userId của CUSTOMER, MEDICALSTAFF, MANAGER
            List<Long> userIds = new ArrayList<>();
            for (com.swp.blooddonation.enums.Role role : List.of(com.swp.blooddonation.enums.Role.CUSTOMER, com.swp.blooddonation.enums.Role.MEDICALSTAFF, com.swp.blooddonation.enums.Role.MANAGER)) {
                userIds.addAll(accountRepository.findByRole(role).stream().map(Account::getId).toList());
            }
            NotificationRequest noti = NotificationRequest.builder()
                .receiverIds(userIds)
                .title("Cảnh báo lượng máu trong kho thấp")
                .content("Lượng máu usable trong kho hiện tại chỉ còn " + total + "ml. Vui lòng kiểm tra và bổ sung.")
                .type(com.swp.blooddonation.enums.NotificationType.SYSTEM)
                .build();
            notificationService.sendNotification(noti);
        }
    }

    public long countAll() {
        return bloodUnitRepository.count();
    }
    public long countAllUnits() {
        Long sum = bloodUnitRepository.sumUnits();
        return sum != null ? sum : 0;
    }
    public long countByUserId(Long userId) {
        return bloodUnitRepository.countByDonorId(userId);
    }
    public long countUnitsByUserId(Long userId) {
        Long sum = bloodUnitRepository.sumUnitsByUserId(userId);
        return sum != null ? sum : 0;
    }

    // Lấy danh sách túi máu (không phân trang)
    public List<BloodUnit> getAllBloodUnits() {
        List<BloodUnit> units = bloodUnitRepository.findAll();
        LocalDate today = LocalDate.now();
        for (BloodUnit unit : units) {
            if (unit.getExpirationDate() != null) {
                long days = java.time.temporal.ChronoUnit.DAYS.between(today, unit.getExpirationDate());
                if (days < 0) {
                    unit.setStatus(BloodUnitStatus.EXPIRED);
                } else if (days <= 7 && unit.getStatus() != BloodUnitStatus.EXPIRED) {
                    unit.setStatus(BloodUnitStatus.NEARLY_EXPIRED);
                }
            }
        }
        return units;
    }

    public List<BloodUnitSimpleResponse> getCollectedBloodUnits() {
        return bloodUnitRepository.findByStatus(BloodUnitStatus.COLLECTED)
            .stream()
            .map(unit -> {
                BloodUnitSimpleResponse dto = new BloodUnitSimpleResponse();
                dto.setId(unit.getId());
                dto.setBloodType(unit.getBloodType() != null ? unit.getBloodType().name() : null);
                dto.setCollectedDate(unit.getCollectedDate());
                dto.setExpirationDate(unit.getExpirationDate());
                dto.setRhType(unit.getRhType() != null ? unit.getRhType().name() : null);
                dto.setTotalVolume(unit.getTotalVolume());
                dto.setCollectedById(unit.getCollectedBy() != null ? unit.getCollectedBy().getId() : null);
                dto.setDonorId(unit.getDonor() != null ? unit.getDonor().getId() : null);
                return dto;
            })
            .toList();
    }

    // Lấy chi tiết túi máu
    public Optional<BloodUnit> getBloodUnitById(Long id) {
        return bloodUnitRepository.findById(id);
    }

    // Cập nhật trạng thái túi máu
    public BloodUnit updateBloodUnitStatus(Long id, BloodUnitStatus status) {
        BloodUnit unit = bloodUnitRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Blood unit not found"));
        unit.setStatus(status);
        return bloodUnitRepository.save(unit);
    }

    // Thêm phương thức xóa túi máu
    @Transactional
    public void deleteBloodUnit(Long id) {
        BloodUnit unit = bloodUnitRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Blood unit not found"));
        bloodUnitRepository.delete(unit);
    }

    // Lấy tất cả máu thành phần (phân tích)
    public List<BloodComponent> getAllBloodComponents() {
        return bloodComponentRepository.findAll();
    }
}
