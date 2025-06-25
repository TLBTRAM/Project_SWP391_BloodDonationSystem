package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.request.AppointmentRequest;
import com.swp.blooddonation.entity.*;
//import com.swp.blooddonation.entity.MedicineService;
import com.swp.blooddonation.enums.AppointmentEnum;
import com.swp.blooddonation.enums.BloodTestStatus;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {
    
    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    AccountSlotRepository accountSlotRepository;

    @Autowired
    AuthenticationReponsitory authenticationReponsitory;

    @Autowired
    AuthenticationService authenticationService;

    @Autowired
    BloodTestRepository bloodTestRepository;

    @Autowired
    SlotRepository slotRepository;

    @Autowired
    EmailService emailService;

    @Autowired
    CustomerRepository customerRepository;

    @Transactional
    public Appointment create(AppointmentRequest appointmentRequest) {
        Account account = authenticationService.getCurrentAccount();
        if(!account.getRole().equals(Role.CUSTOMER)){
            throw new BadRequestException("Only donor have permission to this action!");
        }
        Slot slot = slotRepository.findById(appointmentRequest.getSlotId())
            .orElseThrow(() -> new BadRequestException("Slot not found"));
        if(appointmentRepository.existsByCustomerAndSlotAndAppointmentDate(account, slot, appointmentRequest.getAppointmentDate())) {
            throw new BadRequestException("You have already booked this slot on the selected date");
        }
        if(account.getCustomer() != null && account.getCustomer().getLastDonationDate() != null) {
            LocalDate lastDonation = account.getCustomer().getLastDonationDate();
            LocalDate minNextDonation = lastDonation.plusDays(90); // 90 days for whole blood, 56 days for plasma
            if(LocalDate.now().isBefore(minNextDonation)) {
                throw new BadRequestException("You must wait at least 90 days between blood donations. Next eligible date: " + minNextDonation);
            }
        }

        // Lấy danh sách MedicalStaff trực trong slot đó
        List<AccountSlot> staffInSlot = accountSlotRepository
                .findBySlot_IdAndDateAndAccount_Role(slot.getId(), appointmentRequest.getAppointmentDate(), Role.MEDICALSTAFF);

//        // Gán nhân viên còn trống lượt (tối đa 3 người / slot)
//        Account assignedStaff = staffInSlot.stream()
//                .sorted(Comparator.comparing(s -> s.getAccount().getId()))
//                .map(AccountSlot::getAccount)
//                .filter(staff -> appointmentRepository.countBySlotAndAppointmentDateAndMedicalStaff(
//                        slot, appointmentRequest.getAppointmentDate(), staff) < 3)
//                .findFirst()
//                .orElseThrow(() -> new BadRequestException("All medical staff in this slot are fully booked."));
//

        if (staffInSlot.isEmpty()) {
            throw new BadRequestException("No medical staff available in this slot");
        }

        // Sắp xếp danh sách nhân viên theo ID để đảm bảo vòng xoay cố định
        List<Account> sortedStaff = staffInSlot.stream()
                .map(AccountSlot::getAccount)
                .sorted(Comparator.comparing(Account::getId))
                .collect(Collectors.toList());

        int staffCount = sortedStaff.size();

        // Đếm tổng số lịch hẹn đã được đặt trong slot này
        int totalAppointments = appointmentRepository.countBySlotAndAppointmentDate(slot, appointmentRequest.getAppointmentDate());

        // Xác định nhân viên theo vòng xoay (mod staffCount)
        int staffIndex = totalAppointments % staffCount;
        Account assignedStaff = sortedStaff.get(staffIndex);


        Appointment appointment = new Appointment();
        appointment.setCreateAts(LocalDate.now());
        appointment.setAppointmentDate(appointmentRequest.getAppointmentDate());
        appointment.setStatus(AppointmentEnum.PENDING);
        appointment.setCustomer(account);
        appointment.setSlot(slot);
        appointment.setMedicalStaff(assignedStaff);

        return appointmentRepository.save(appointment);
    }
    
    public List<Appointment> getMyAppointments() {
        Account currentAccount = authenticationService.getCurrentAccount();
        return appointmentRepository.findByCustomer(currentAccount);
    }
    
    public List<Appointment> getStaffAppointments() {
        Account currentAccount = authenticationService.getCurrentAccount();
        return appointmentRepository.findByMedicalStaff(currentAccount);
    }
    
    public Appointment findById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Appointment not found with id: " + id));
    }
    
    @Transactional
    public Appointment cancelAppointment(Long id) {
        Appointment appointment = findById(id);
        Account currentAccount = authenticationService.getCurrentAccount();
        
        // Kiểm tra chỉ donor mới có thể hủy appointment của mình
        if(appointment.getCustomer().getId() != currentAccount.getId()) {
            throw new BadRequestException("You can only cancel your own appointments");
        }
        
        // Kiểm tra appointment có thể hủy không
        if(appointment.getStatus() != AppointmentEnum.PENDING) {
            throw new BadRequestException("Only pending appointments can be cancelled");
        }
        
        // Hủy appointment
        appointment.setStatus(AppointmentEnum.CANCEL);
        appointmentRepository.save(appointment);
        
        // Giải phóng slot
        AccountSlot accountSlot = accountSlotRepository.findAccountSlotBySlotIdAndAccountAndDate(
            appointment.getSlot().getId(),
            appointment.getCustomer(),
            appointment.getAppointmentDate()
        );
        
        if(accountSlot != null) {
            accountSlot.setAvailable(true);
            accountSlotRepository.save(accountSlot);
        }
        
        return appointment;
    }
    
    @Transactional
    public Appointment completeAppointment(Long id) {
        Appointment appointment = findById(id);
        Account currentAccount = authenticationService.getCurrentAccount();
        
        // Kiểm tra chỉ medical staff mới có thể hoàn thành appointment
        if(appointment.getMedicalStaff().getId() != currentAccount.getId()) {
            throw new BadRequestException("Only the assigned medical staff can complete this appointment");
        }
        
        // Kiểm tra appointment có thể hoàn thành không
        if(appointment.getStatus() != AppointmentEnum.PENDING) {
            throw new BadRequestException("Only pending appointments can be completed");
        }
        
        // Hoàn thành appointment
        appointment.setStatus(AppointmentEnum.COMPLETED);
        appointmentRepository.save(appointment);
        
        // Cập nhật thông tin donor (ngày hiến máu cuối)
        if(appointment.getCustomer() != null && appointment.getCustomer().getCustomer() != null) {
            appointment.getCustomer().getCustomer().setLastDonationDate(LocalDate.now());
        }
        
        return appointment;
    }
    
    @Transactional
    public Appointment approveAppointment(Long id) {
        Appointment appointment = findById(id);
        Account currentAccount = authenticationService.getCurrentAccount();
        if(!currentAccount.getRole().equals(Role.MEDICALSTAFF)) {
            throw new BadRequestException("Only medical staff can approve appointments");
        }
        if(appointment.getStatus() != AppointmentEnum.PENDING) {
            throw new BadRequestException("Only pending appointments can be approved");
        }
        appointment.setStatus(AppointmentEnum.APPROVED);
        appointment.setMedicalStaff(currentAccount);
        appointmentRepository.save(appointment);
        return appointment;
    }

    @Transactional
    public Appointment rejectAppointment(Long id) {
        Appointment appointment = findById(id);
        Account currentAccount = authenticationService.getCurrentAccount();
        if(!currentAccount.getRole().equals(Role.MEDICALSTAFF)) {
            throw new BadRequestException("Only medical staff can reject appointments");
        }
        if(appointment.getStatus() != AppointmentEnum.PENDING) {
            throw new BadRequestException("Only pending appointments can be rejected");
        }
        appointment.setStatus(AppointmentEnum.REJECTED);
        appointment.setMedicalStaff(currentAccount);
        appointmentRepository.save(appointment);
        return appointment;
    }
    
//    public List<Appointment> findAll() {
//        return appointmentRepository.findAll();
//    }
//
//    @Transactional
//    public Appointment update(Long id, AppointmentRequest appointmentRequest) {
//        Appointment existingAppointment = findById(id);
//        // Update appointment properties from appointmentRequest
//        // existingAppointment.set...
//
//        return appointmentRepository.save(existingAppointment);
//    }
//
//    @Transactional
//    public void delete(Long id) {
//        appointmentRepository.deleteById(id);
//    }


    @Transactional
    public Appointment collectBlood(Long appointmentId) {
        Account current = authenticationService.getCurrentAccount();
        if (!current.getRole().equals(Role.MEDICALSTAFF)) {
            throw new BadRequestException("Only medical staff can collect blood.");
        }

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new BadRequestException("Appointment not found"));

        BloodTest test = bloodTestRepository.findByAppointment(appointment)
                .orElseThrow(() -> new BadRequestException("No blood test found for this appointment"));

        if (test.getStatus() != BloodTestStatus.COMPLETED) {
            throw new BadRequestException("Blood test not completed or failed");
        }

        appointment.setStatus(AppointmentEnum.COLLECTED);

        // Cập nhật ngày hiến máu cuối cùng cho Donor
        if (appointment.getCustomer().getCustomer() != null) {
            appointment.getCustomer().getCustomer().setLastDonationDate(LocalDate.now());
        }

//        // Gửi email cảm ơn
//        emailService.sendEmail(
//                appointment.getCustomer().getEmail(),
//                "Cảm ơn bạn đã hiến máu",
//                "<h3>Xin chân thành cảm ơn bạn đã hiến máu vào ngày " + appointment.getAppointmentDate() + "!</h3>"
//        );

        return appointmentRepository.save(appointment);
    }
}
