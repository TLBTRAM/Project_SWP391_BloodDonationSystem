package com.swp.blooddonation.service;


import com.swp.blooddonation.dto.request.NotificationRequest;
import com.swp.blooddonation.dto.request.NotificationRequest;
import com.swp.blooddonation.dto.request.RegisterRequest;
import com.swp.blooddonation.entity.*;
import com.swp.blooddonation.enums.AppointmentEnum;
import com.swp.blooddonation.enums.NotificationType;
import com.swp.blooddonation.enums.NotificationType;
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
import java.util.Objects;
import java.util.stream.Collectors;

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

    @Autowired
    PendingPatientRequestRepository pendingPatientRequestRepository;

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    private NotificationService notificationService;


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

        boolean exists = registerRepository.existsByAccountAndSlotAndRegisterDate(
                currentUser, slot, registerDate);

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
        // 1. Lấy đơn đăng ký
        Register register = registerRepository.findById(registerId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy đơn đăng ký."));

        if (register.getStatus() != RegisterStatus.PENDING) {
            throw new BadRequestException("Chỉ được duyệt đơn đang ở trạng thái PENDING.");
        }

        Slot slot = register.getSlot();
        LocalDate date = register.getRegisterDate();

        // 2. Lấy danh sách nhân viên y tế có lịch làm việc cho slot này vào ngày đó
        List<Account> medicalStaffList = accountSlotRepository
                .findBySlotAndDateAndAccount_Role(slot, date, Role.MEDICALSTAFF)
                .stream()
                .map(AccountSlot::getAccount)
                .collect(Collectors.toList());

        if (medicalStaffList.isEmpty()) {
            throw new BadRequestException("Không có nhân viên y tế nào cho slot này.");
        }

        // 3. Lấy toàn bộ các Register (không chỉ PENDING), sắp xếp theo createdAt
        List<Register> allRegistersForSlotAndDate = registerRepository
                .findBySlotAndRegisterDateOrderByCreatedAt(slot, date);

        // 4. Tìm vị trí (index) của register hiện tại
        int registerIndex = -1;
        for (int i = 0; i < allRegistersForSlotAndDate.size(); i++) {
            if (Objects.equals(allRegistersForSlotAndDate.get(i).getId(), registerId)) {
                registerIndex = i;
                break;
            }
        }

        if (registerIndex == -1) {
            throw new BadRequestException("Không xác định được thứ tự đăng ký.");
        }

        // 5. Gán staff theo index % số lượng staff
        Account selectedStaff = null;
        int staffCount = medicalStaffList.size();
        for (int offset = 0; offset < staffCount; offset++) {
            int index = (registerIndex + offset) % staffCount;
            Account candidate = medicalStaffList.get(index);
            long assigned = appointmentRepository.countByMedicalStaffAndSlotAndAppointmentDate(candidate, slot, date);
            if (assigned < 3) {
                selectedStaff = candidate;
                break;
            }
        }

        if (selectedStaff == null) {
            throw new BadRequestException("Tất cả nhân viên y tế đã đủ 3 lịch cho slot này.");
        }

        // 6. Cập nhật đơn đăng ký
        register.setStatus(RegisterStatus.APPROVED);
        registerRepository.save(register);

        // 7. Tạo lịch hẹn
        Appointment appointment = new Appointment();
        appointment.setRegister(register);
        appointment.setCustomer(register.getAccount());
        appointment.setMedicalStaff(selectedStaff);
        appointment.setSlot(slot);
        appointment.setAppointmentDate(date);
        appointment.setStatus(AppointmentEnum.SCHEDULED);
        appointment.setCreatedAt(LocalDateTime.now());

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // 8. Gửi thông báo
        NotificationRequest noti = NotificationRequest.builder()
                .receiverIds(List.of(register.getAccount().getId()))
                .title("Đơn đăng ký hiến máu đã được duyệt")
                .content("Bạn đã được đặt lịch hiến máu vào ngày " + date + ".")
                .type(NotificationType.APPOINTMENT)
                .build();
        notificationService.sendNotification(noti);

        // TODO: Gửi email (nếu có yêu cầu)

        return savedAppointment;
    }



    @Transactional
    public void rejectRegister(Long registerId, String reason) {
        Account currentUser = authenticationService.getCurrentAccount();

        if (!currentUser.getRole().equals(Role.MEDICALSTAFF)) {
            throw new BadRequestException("Chỉ nhân viên y tế mới có quyền từ chối đơn đăng ký.");
        }

        Register register = registerRepository.findById(registerId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy đơn đăng ký."));

        if (register.getStatus() != RegisterStatus.PENDING) {
            throw new BadRequestException("Chỉ có thể từ chối đơn đăng ký đang chờ duyệt.");
        }

        register.setStatus(RegisterStatus.REJECTED);
        register.setRejectedBy(currentUser);
        register.setRejectionReason(reason);
        registerRepository.save(register);
    }



    @Transactional
    public Register cancelRegisterByCustomer(Long registerId, String reason) {
        Account currentUser = authenticationService.getCurrentAccount();

        Register register = registerRepository.findById(registerId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy đơn đăng ký."));

        if (!register.getAccount().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Bạn không có quyền hủy đơn đăng ký này.");
        }

        if (register.getStatus() == RegisterStatus.CANCELED) {
            throw new BadRequestException("Đơn đăng ký đã bị hủy trước đó.");
        }

        if (register.getStatus() != RegisterStatus.PENDING) {
            throw new BadRequestException("Chỉ có thể hủy đơn đăng ký đang chờ duyệt (PENDING).");
        }

        register.setStatus(RegisterStatus.CANCELED);
        register.setCanceledAt(LocalDateTime.now());
        register.setCancelReason(reason);
        return registerRepository.save(register);
    }










}

