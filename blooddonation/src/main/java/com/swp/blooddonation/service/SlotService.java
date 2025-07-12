package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.AccountDTO;
import com.swp.blooddonation.dto.RegisterSlotDTO;
import com.swp.blooddonation.dto.SlotDTO;
import com.swp.blooddonation.entity.*;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.enums.ScheduleStatus;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.exception.exceptions.UserNotFoundException;
import com.swp.blooddonation.repository.AccountSlotRepository;
import com.swp.blooddonation.repository.AuthenticationReponsitory;
import com.swp.blooddonation.repository.ScheduleRepository;
import com.swp.blooddonation.repository.SlotRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SlotService {

    @Autowired
    SlotRepository slotRepository;

    @Autowired
    AuthenticationReponsitory authenticationReponsitory;

    @Autowired
    AuthenticationService authenticationService;

    @Autowired
    AccountSlotRepository accountSlotRepository;

    @Autowired
    ScheduleRepository scheduleRepository;

    @Autowired
    UserService userService;

    @Autowired
    ModelMapper modelMapper;

    //font-end load được list slot
    public List<Slot> get() {
        return slotRepository.findAll();
    }

    public void generateSlots() {
        LocalTime start = LocalTime.of(7, 0);
        LocalTime end = LocalTime.of(17, 0);
        List<Slot> slots = new ArrayList<>();

        while (start.isBefore(end)) {
            LocalTime slotStart = start;
            LocalTime slotEnd = start.plusMinutes(30);

            boolean exists = slotRepository.existsByStartTimeAndEndTime(slotStart, slotEnd);
            if (!exists) {
                Slot slot = new Slot();
                slot.setLabel(slotStart + " - " + slotEnd);
                slot.setStartTime(slotStart);
                slot.setEndTime(slotEnd);
                slot.setDelete(false);
                slots.add(slot);
            }

            start = slotEnd;
        }

        if (!slots.isEmpty()) {
            slotRepository.saveAll(slots);
        }
    }


    @Transactional
    public List<AccountSlot> registerSlot(RegisterSlotDTO registerSlotDTO) {
        User currentUser = userService.getCurrentUser();

         // nếu đã ánh xạ @OneToOne


        if (currentUser.getAccount().getRole() != Role.MEDICALSTAFF) {
            throw new BadRequestException("Chỉ Medical Staff mới được đăng ký lịch làm việc.");
        }

        LocalDate date = registerSlotDTO.getDate();
//        DayOfWeek dayOfWeek = date.getDayOfWeek();
//        if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
//            throw new BadRequestException("Không được đăng ký lịch vào Thứ 7 hoặc Chủ nhật.");
//        }

        boolean hasOpenSchedule = scheduleRepository.existsByScheduleDateAndStatus(date, ScheduleStatus.OPEN);
        if (!hasOpenSchedule) {
            throw new BadRequestException("Không thể đăng ký vì chưa có lịch làm việc (Schedule) OPEN cho ngày " + date + ".");
        }

        boolean existed = accountSlotRepository.existsByUserAndDate(currentUser, date);
        if (existed) {
            throw new BadRequestException("Bạn đã đăng ký lịch cho ngày này.");
        }

        List<AccountSlot> accountSlots = new ArrayList<>();
        List<Slot> allSlots = slotRepository.findAll();

        for (Slot slot : allSlots) {
            long count = accountSlotRepository.countBySlot_IdAndDateAndUser_Account_Role(
                    slot.getId(), date, Role.MEDICALSTAFF
            );

            if (count >= 5) {
                throw new BadRequestException("Slot '" + slot.getId() + "' đã đủ 5 người đăng ký.");
            }

            AccountSlot accountSlot = new AccountSlot();
            accountSlot.setSlot(slot);
            accountSlot.setUser(currentUser);
            accountSlot.setDate(date);
            accountSlot.setAvailable(true);

            accountSlots.add(accountSlot);
        }

        accountSlotRepository.saveAll(accountSlots);

        return accountSlots;
    }



//    public List<AccountSlot> getRegisteredSlots(Long medicalStaffId, LocalDate date) {
//        Account medicalStaff = authenticationReponsitory.findById(medicalStaffId)
//                .orElseThrow(() -> new BadRequestException("Doctor not found"));
//
//        List<AccountSlot> accountSlots = accountSlotRepository.findAccountSlotsByAccountAndDate(medicalStaff,date);
//        List<AccountSlot> slotsAvailable = new ArrayList<>();
//        for(AccountSlot accountSlot : accountSlots){
//            if(accountSlot.isAvailable()){
//                slotsAvailable.add(accountSlot);
//            }
//
//        }
//        return  slotsAvailable;
//    }
//
//    public List<AccountSlot> getAvailableSlotsByDate(LocalDate date) {
//        List<AccountSlot> accountSlots = accountSlotRepository.findByDate(date);
//        return accountSlots.stream()
//                .filter(AccountSlot::isAvailable)
//                .collect(Collectors.toList());
//    }
//
//
//    public List<AccountDTO> getMedicalStaffByDate(LocalDate date) {
//        List<AccountSlot> accountSlots = accountSlotRepository
//                .findByDateAndAccount_Role( date, Role.MEDICALSTAFF);
//
//        return accountSlots.stream()
//                .map(AccountSlot::getAccount)
//                .distinct()
//                .map(account -> modelMapper.map(account, AccountDTO.class))
//                .collect(Collectors.toList());
//    }
}
