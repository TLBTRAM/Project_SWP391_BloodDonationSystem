package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.request.BloodComponentVolumeRequest;
import com.swp.blooddonation.dto.request.CollectBloodRequest;
import com.swp.blooddonation.entity.*;
import com.swp.blooddonation.enums.*;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;


@Service
public class BloodUnitService {
    @Autowired
    BloodUnitRepository bloodUnitRepository;

    @Autowired
    BloodTestRepository bloodTestRepository;

    @Autowired
    AuthenticationService authenticationService;

    @Autowired
    MedicalStaffRepository medicalStaffRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    BloodComponentRepository bloodComponentRepository;


    @Transactional
    public BloodUnit collectBlood(CollectBloodRequest request) {
        Account currentUser = authenticationService.getCurrentAccount();

        if (!currentUser.getRole().equals(Role.MEDICALSTAFF)) {
            throw new BadRequestException("Only medical staff can collect blood.");
        }

        // Lấy kết quả xét nghiệm
        BloodTest test = bloodTestRepository.findById(request.getTestId())
                .orElseThrow(() -> new BadRequestException("Blood test not found"));

        if (test.getStatus() != BloodTestStatus.COMPLETED) {
            throw new BadRequestException("Blood test must be completed first.");
        }

        // Lấy người hiến từ appointment
        Appointment appointment = test.getAppointment();
        Account donorAccount = appointment.getCustomer();

        Customer donor = customerRepository.findByAccount(donorAccount)
                .orElseThrow(() -> new BadRequestException("The linked account is not a donor."));

        // Lấy thông tin MedicalStaff từ account hiện tại
        MedicalStaff staff = medicalStaffRepository.findById(currentUser.getId())
                .orElseThrow(() -> new BadRequestException("Medical staff not found"));

        // Validate thể tích
        if (request.getTotalVolume() <= 0 || request.getTotalVolume() > 500) {
            throw new BadRequestException("Total volume must be between 1 and 500 ml.");
        }

        // Tạo BloodUnit
        BloodUnit unit = new BloodUnit();
        unit.setBloodType(request.getBloodType());
        unit.setRhType(request.getRhType());
        unit.setTotalVolume(request.getTotalVolume());
        unit.setCollectedDate(LocalDate.now());
        unit.setExpirationDate(LocalDate.now().plusDays(42)); // Hạn dùng máu toàn phần: 42 ngày
        unit.setDonor(donor);
        unit.setCollectedBy(staff);
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


}
