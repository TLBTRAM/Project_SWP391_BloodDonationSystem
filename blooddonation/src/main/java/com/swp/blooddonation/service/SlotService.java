package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.AccountDTO;
import com.swp.blooddonation.dto.RegisterSlotDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.AccountSlot;
import com.swp.blooddonation.entity.Slot;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.exception.exceptions.UserNotFoundException;
import com.swp.blooddonation.repository.AccountSlotRepository;
import com.swp.blooddonation.repository.AuthenticationReponsitory;
import com.swp.blooddonation.repository.SlotRepository;
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
    AccountSlotRepository accountSlotRepository;

    @Autowired
    ModelMapper modelMapper;

    //font-end load được list slot
    public List<Slot> get() {
        return slotRepository.findAll();
    }

    public void generateSlots() {

        //Generate tự động slot từ 7h sáng đến 17h chiều
        LocalTime start = LocalTime.of(7, 0);
        LocalTime end = LocalTime.of(17, 0);
        List<Slot> slots = new ArrayList<>();

        while (start.isBefore(end)) {
            Slot slot = new Slot();
            slot.setLabel(start.toString());
            slot.setStart(start);
            slot.setEnd(start.plusMinutes(30));

            slots.add(slot);
            start = start.plusMinutes(30);
        }
        slotRepository.saveAll(slots);
    }

    public List<AccountSlot> registerSlot(RegisterSlotDTO registerSlotDTO) {
        Account account = authenticationReponsitory.findById(registerSlotDTO.getAccountId())
                .orElseThrow(() -> new UserNotFoundException("Account không tồn tại"));


        // nếu đã dùng @PreAuthorize("hasRole('MEDICALSTAFF')") thì không cần kiểm tra role nữa
//        if (account.getRole() != Role.MEDICALSTAFF) {
//            throw new BadRequestException("Bạn không có quyền đăng ký lịch này.");
//        }

        LocalDate date = registerSlotDTO.getDate();

        // Không cho đăng ký vào Thứ 7 và Chủ nhật
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        if (dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY) {
            throw new BadRequestException("Không được đăng ký lịch vào Thứ 7 hoặc Chủ nhật.");
        }

        List<AccountSlot> oldAccountSlot = accountSlotRepository.
                findAccountsSlotsByAccountAndDate(account, registerSlotDTO.getDate());

        if (!oldAccountSlot.isEmpty()) {
            throw new BadRequestException("Tài khoản đã đăng ký lịch cho ngày này.");
        }

        List<AccountSlot> accountSlots = new ArrayList<>();
        for (Slot slot : slotRepository.findAll()) {
            long count = accountSlotRepository.countBySlot_IdAndDateAndAccount_Role(
                    slot.getId(), registerSlotDTO.getDate(), Role.MEDICALSTAFF
            );

            if (count >= 5) {
                throw new BadRequestException("Slot '" + slot.getId() + "' đã đủ 5 người đăng ký.");
            }

            AccountSlot accountSlot = new AccountSlot();
            accountSlot.setSlot(slot);
            accountSlot.setAccount(account);
            accountSlot.setDate(registerSlotDTO.getDate());
            accountSlots.add(accountSlot);

        }
        return accountSlotRepository.saveAll(accountSlots);
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

    public List<AccountSlot> getAvailableSlotsByDate(LocalDate date) {
        List<AccountSlot> accountSlots = accountSlotRepository.findByDate(date);
        return accountSlots.stream()
                .filter(AccountSlot::isAvailable)
                .collect(Collectors.toList());
    }


    public List<AccountDTO> getMedicalStaffByDate(LocalDate date) {
        List<AccountSlot> accountSlots = accountSlotRepository
                .findByDateAndAccount_Role( date, Role.MEDICALSTAFF);

        return accountSlots.stream()
                .map(AccountSlot::getAccount)
                .distinct()
                .map(account -> modelMapper.map(account, AccountDTO.class))
                .collect(Collectors.toList());
    }
}
