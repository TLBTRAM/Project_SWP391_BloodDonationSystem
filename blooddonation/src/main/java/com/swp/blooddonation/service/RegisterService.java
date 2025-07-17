package com.swp.blooddonation.service;


import com.swp.blooddonation.dto.request.NotificationRequest;
import com.swp.blooddonation.dto.request.RegisterRequest;
import com.swp.blooddonation.dto.response.RegisterResponse;
import com.swp.blooddonation.entity.*;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.enums.AppointmentEnum;
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
import com.swp.blooddonation.repository.BloodTestRepository;

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

    @Autowired
    UserRepository userRepository;
    @Autowired
    UserService userService;

    @Autowired
    private BloodTestRepository bloodTestRepository;


    @Transactional
    public Register createRegister(RegisterRequest request) {


        User currentUser = userService.getCurrentUser();
        if (currentUser == null) {
            throw new BadRequestException("Thông tin người dùng không tồn tại.");
        }

        LocalDate registerDate = request.getDate();

        boolean isWorkingThatDay = accountSlotRepository
                .existsByUserAndDate(currentUser, registerDate);

        if (isWorkingThatDay) {
            throw new BadRequestException("Bạn đã đăng ký làm việc trong ngày này nên không thể đăng ký hiến máu.");
        }

        Slot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new BadRequestException("Không tìm thấy slot."));

        Schedule schedule = scheduleRepository.findByScheduleDate(registerDate)
                .orElseThrow(() -> new BadRequestException("Không có lịch làm việc cho ngày đã chọn."));

        if (schedule.getStatus() != com.swp.blooddonation.enums.ScheduleStatus.OPEN) {
            throw new BadRequestException("Chỉ được đăng ký vào ngày có lịch làm việc OPEN.");
        }

        // BỎ kiểm tra workingStaff
        // List<AccountSlot> workingStaff = accountSlotRepository
        //         .findByDateAndUser_Account_Role(registerDate, Role.MEDICALSTAFF);
        // if (workingStaff.isEmpty()) {
        //     throw new BadRequestException("Chưa có nhân viên y tế làm việc trong ngày đã chọn.");
        // }

        boolean exists = registerRepository.existsByUserAndSlotAndRegisterDate(
                currentUser, slot, registerDate); // 💡 Đổi lại method đúng theo field

        if (exists) {
            throw new BadRequestException("Bạn đã đăng ký slot này vào ngày này.");
        }

        Register register = new Register();
        register.setUser(currentUser);
        register.setRegisterDate(registerDate);
        register.setSlot(slot);
        register.setSchedule(schedule);
        register.setNote(request.getNote());
        register.setStatus(RegisterStatus.PENDING);
        register.setCreatedAt(LocalDateTime.now());

        return registerRepository.save(register);
    }

    public RegisterResponse toRegisterResponse(Register reg) {
        Boolean passed = null;
        if (reg.getId() != null) {
            var testOpt = bloodTestRepository.findByRegister(reg);
            if (testOpt.isPresent()) {
                var test = testOpt.get();
                // Nếu có TestResult thì lấy passed từ đó, hoặc lấy từ BloodTest nếu lưu ở đó
                // Ở đây giả sử passed lưu trong BloodTest (nếu không, cần join sang TestResult)
                passed = test.getResult() != null ? test.getResult().equalsIgnoreCase("ok") && test.getStatus().name().equals("COMPLETED") : null;
                // Nếu bạn lưu passed ở TestResult, hãy sửa lại dòng trên cho đúng
            }
        }
        return new RegisterResponse(
            reg.getId(),
            reg.getRegisterDate(),
            reg.getStatus() != null ? reg.getStatus().name() : null,
            reg.getNote(),
            reg.getSlot(),
            reg.getUser() != null ? reg.getUser().getId() : null,
            reg.getUser() != null ? reg.getUser().getFullName() : null,
            passed
        );
    }


    @Transactional
    public Appointment approveRegister(Long registerId) {
        Register register = registerRepository.findById(registerId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy đơn đăng ký."));

        if (register.getStatus() != RegisterStatus.PENDING) {
            throw new BadRequestException("Chỉ được duyệt đơn đang ở trạng thái PENDING.");
        }

        // BỎ HOÀN TOÀN kiểm tra và gán staff
        register.setStatus(RegisterStatus.APPROVED);
        registerRepository.save(register);

        Appointment appointment = new Appointment();
        appointment.setRegister(register);
        appointment.setCustomer(register.getUser());
        appointment.setSlot(register.getSlot());
        appointment.setAppointmentDate(register.getRegisterDate());
        appointment.setStatus(AppointmentEnum.SCHEDULED);
        appointment.setCreatedAt(LocalDateTime.now());
        // Không gán medicalStaff

        Appointment savedAppointment = appointmentRepository.save(appointment);

        NotificationRequest noti = NotificationRequest.builder()
                .receiverIds(List.of(register.getUser().getId()))
                .title("Đơn đăng ký hiến máu đã được duyệt")
                .content("Bạn đã được đặt lịch hiến máu vào ngày " + register.getRegisterDate() + ".")
                .type(NotificationType.APPOINTMENT)
                .build();
        notificationService.sendNotification(noti);

        return savedAppointment;
    }



    @Transactional
    public void rejectRegister(Long registerId, String reason) {
        User currentUser = userService.getCurrentUser();

        if (!currentUser.getAccount().getRole().equals(Role.MEDICALSTAFF)) {
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
        User currentUser = userService.getCurrentUser();

        Register register = registerRepository.findById(registerId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy đơn đăng ký."));

        if (!register.getUser().getId().equals(currentUser.getId())) {
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


    public List<RegisterResponse> getAllRegisters() {
        return registerRepository.findAll().stream()
            .map(this::toRegisterResponse)
            .collect(Collectors.toList());
    }

    public List<RegisterResponse> getApprovedRegisters() {
        return registerRepository.findByStatus(RegisterStatus.APPROVED)
            .stream()
            .map(this::toRegisterResponse)
            .collect(Collectors.toList());
    }

    public RegisterResponse createRegisterAndReturn(RegisterRequest request) {
        Register reg = createRegister(request);
        return toRegisterResponse(reg);
    }

    public void updateRegisterStatus(Long registerId, RegisterStatus status, String reason) {
        Register register = registerRepository.findById(registerId)
            .orElseThrow(() -> new BadRequestException("Không tìm thấy đơn đăng ký."));
        if (status == RegisterStatus.REJECTED) {
            register.setStatus(RegisterStatus.REJECTED);
            register.setRejectionReason(reason);
        } else if (status == RegisterStatus.APPROVED) {
            register.setStatus(RegisterStatus.APPROVED);
        } else if (status == RegisterStatus.PENDING) {
            register.setStatus(RegisterStatus.PENDING);
            register.setRejectionReason(null);
            register.setCancelReason(null);
        } else {
            throw new BadRequestException("Chỉ được cập nhật sang trạng thái PENDING, APPROVED hoặc REJECTED.");
        }
        registerRepository.save(register);
    }

    public List<RegisterResponse> getRegistersByAccount(Account account) {
        User user = userRepository.findByAccount(account)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy user cho account này!"));
        List<Register> registers = registerRepository.findByUser(user);
        return registers.stream().map(this::toRegisterResponse).collect(Collectors.toList());
    }

    public List<RegisterResponse> getPendingRegistersByAccount(Account account) {
        User user = userRepository.findByAccount(account)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy user cho account này!"));
        List<Register> registers = registerRepository.findByUserAndStatus(user, RegisterStatus.PENDING);
        return registers.stream().map(this::toRegisterResponse).collect(Collectors.toList());
    }


}

