package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.AccountDTO;
import com.swp.blooddonation.dto.RegisterSlotDTO;
import com.swp.blooddonation.dto.SlotDTO;
import com.swp.blooddonation.entity.AccountSlot;
import com.swp.blooddonation.entity.Schedule;
import com.swp.blooddonation.entity.Slot;
import com.swp.blooddonation.service.SlotService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@SecurityRequirement(name = "api")
@RequestMapping("/api/slot")
public class SlotAPI {

    @Autowired
    SlotService slotService;


    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER','MEDICALSTAFF' )")
    @PostMapping("generate")
    public void generateSlot(){
        slotService.generateSlots();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER','MEDICALSTAFF', 'CUSTOMER' )")
    @GetMapping("getSlot")
    public ResponseEntity getSlot(){
        List<Slot> slots = slotService.get();
        return ResponseEntity.ok(slots);
    }

    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @PostMapping("/register")
    public ResponseEntity registerSlot(@RequestBody RegisterSlotDTO registerSlotDTO )
    {
        List<AccountSlot>  accountSlots = slotService.registerSlot(registerSlotDTO);
        return ResponseEntity.ok(accountSlots);
    }

//    @GetMapping("/medical-staff-by-date")
//    public ResponseEntity<List<AccountDTO>> getMedicalStaffByDate(
//            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
//
//        List<AccountDTO> staffList = slotService.getMedicalStaffByDate(date);
//        return ResponseEntity.ok(staffList);
//    }
//
//    @GetMapping("/available-slots")
//    public ResponseEntity getRegisteredSlots(
//            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
//        List<AccountSlot> slots = slotService.getAvailableSlotsByDate(date);
//        return ResponseEntity.ok(slots);
//    }

}
