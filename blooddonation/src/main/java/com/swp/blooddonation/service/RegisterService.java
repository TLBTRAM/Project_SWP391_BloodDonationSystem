package com.swp.blooddonation.service;


import com.swp.blooddonation.dto.request.RegisterRequest;
import com.swp.blooddonation.entity.*;
import com.swp.blooddonation.enums.AppointmentEnum;
import com.swp.blooddonation.enums.RegisterStatus;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegisterService {

    private final AuthenticationService authenticationService;
    private final SlotRepository slotRepository;
    private final RegisterRepository registerRepository;

    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    AccountSlotRepository accountSlotRepository;

    @Autowired
    ScheduleRepository scheduleRepository;

    @Transactional
    public Register createRegister(RegisterRequest request) {
        Account currentUser = authenticationService.getCurrentAccount();



        LocalDate registerDate = request.getDate();

        Slot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new BadRequestException("Không tìm thấy slot."));

        Schedule schedule = scheduleRepository.findByScheduleDate(registerDate)
                .orElseThrow(() -> new BadRequestException("Không có lịch làm việc cho ngày đã chọn."));


        List<AccountSlot> workingStaff = accountSlotRepository
                .findByDateAndAccount_Role(registerDate, Role.MEDICALSTAFF);

        if (workingStaff.isEmpty()) {
            throw new BadRequestException("Chưa có nhân viên y tế làm việc trong ngày đã chọn.");
        }

        boolean exists = registerRepository.existsByAccountAndSlot_IdAndRegisterDate(
                currentUser, slot.getId(), registerDate);

        if (exists) {
            throw new BadRequestException("Bạn đã đăng ký slot này vào ngày này.");
        }

        Register register = new Register();
        register.setAccount(currentUser);
        register.setRegisterDate(registerDate);
        register.setSlot(slot);
        register.setSchedule(schedule);
        register.setNote(request.getNote());
        register.setStatus(RegisterStatus.PENDING);
        register.setCreatedAt(LocalDateTime.now());

        return registerRepository.save(register);
    }

    @Transactional
    public Appointment approveRegister(Long registerId) {
        // 1. Tìm đơn đăng ký
        Register register = registerRepository.findById(registerId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy đơn đăng ký."));

        if (register.getStatus() != RegisterStatus.PENDING) {
            throw new BadRequestException("Chỉ được duyệt đơn đăng ký đang ở trạng thái PENDING.");
        }

        Slot slot = register.getSlot();
        LocalDate date = register.getRegisterDate();

        // 2. Lấy danh sách Medical Staff đã đăng ký lịch làm việc cho slot đó ngày đó
        List<AccountSlot> availableStaffSlots = accountSlotRepository.findBySlotAndDateAndAccount_Role(slot, date, Role.MEDICALSTAFF);

        if (availableStaffSlots.isEmpty()) {
            throw new BadRequestException("Không có nhân viên y tế nào đăng ký làm việc cho slot này.");
        }

        // 3. Tìm staff có ít hơn 3 appointment cho slot + ngày
        Account selectedStaff = null;
        for (AccountSlot staffSlot : availableStaffSlots) {
            Account staff = staffSlot.getAccount();
            long assigned = appointmentRepository.countByMedicalStaffAndSlotAndAppointmentDate(staff, slot, date);
            if (assigned < 3) {
                selectedStaff = staff;
                break;
            }
        }

        if (selectedStaff == null) {
            throw new BadRequestException("Tất cả nhân viên y tế đã đủ số lượng phục vụ trong slot này.");
        }

        // 4. Cập nhật trạng thái đơn đăng ký
        register.setStatus(RegisterStatus.APPROVED);
        registerRepository.save(register);

        // 5. Tạo Appointment
        Appointment appointment = new Appointment();
        appointment.setRegister(register);
        appointment.setCustomer(register.getAccount());
        appointment.setMedicalStaff(selectedStaff); // Gán theo thứ tự logic
        appointment.setSlot(slot);
        appointment.setAppointmentDate(date);
        appointment.setStatus(AppointmentEnum.SCHEDULED);
        appointment.setCreatedAt(LocalDateTime.now());

        return appointmentRepository.save(appointment);
    }



}

