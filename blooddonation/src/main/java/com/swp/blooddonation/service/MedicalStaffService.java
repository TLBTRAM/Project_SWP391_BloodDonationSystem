package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.MedicalStaffDTO;
import com.swp.blooddonation.dto.MedicalStaffUpdateDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.MedicalStaff;
import com.swp.blooddonation.repository.AuthenticationReponsitory;
import com.swp.blooddonation.repository.MedicalStaffRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class MedicalStaffService {

    private final MedicalStaffRepository medicalStaffRepository;
    private final AuthenticationReponsitory authenticationReponsitory;
    private final ModelMapper modelMapper;

    // ✅ Lấy hồ sơ nhân viên y tế
    public MedicalStaffDTO getProfile(Account account) {
        MedicalStaff staff = medicalStaffRepository.findById(account.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medical staff not found"));

        MedicalStaffDTO dto = modelMapper.map(staff, MedicalStaffDTO.class);
        dto.setId(account.getId());
        dto.setEmail(account.getEmail());
        dto.setPhone(account.getPhone());
        dto.setFullName(account.getFullName());
        return dto;
    }

    // ✅ Cập nhật thông tin MedicalStaff
    public void updateProfile(Account account, MedicalStaffUpdateDTO dto) {
        MedicalStaff staff = medicalStaffRepository.findById(account.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medical staff not found"));

        // Map AccountUpdateDTO vào Account entity:
        modelMapper.map(dto.getAccount(), account);

        // Map MedicalStaffUpdateDTO vào MedicalStaff entity:
        modelMapper.map(dto, staff);

        // Lưu Account bằng AuthenticationRepository:
        authenticationReponsitory.save(account);

        // Lưu MedicalStaff:
        medicalStaffRepository.save(staff);
    }

}
