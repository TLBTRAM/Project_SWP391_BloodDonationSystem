package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.RecipientDTO;
import com.swp.blooddonation.dto.RecipientUpdateDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.Recipient;
import com.swp.blooddonation.repository.RecipientRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class RecipientService {

    private final RecipientRepository recipientRepository;
    private final ModelMapper modelMapper;

    // ✅ Xem hồ sơ đầy đủ của recipient (bao gồm cả info từ Account)
    public RecipientDTO getProfile(Account account) {
        Recipient recipient = recipientRepository.findById(account.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipient not found"));

        RecipientDTO dto = modelMapper.map(recipient, RecipientDTO.class);
        dto.setId(account.getId());
        dto.setFullName(account.getFullName());
        dto.setEmail(account.getEmail());
        dto.setPhone(account.getPhone());
        return dto;
    }

    // ✅ Cập nhật thông tin y tế của recipient
    public void updateProfile(Account account, RecipientUpdateDTO dto) {
        Recipient recipient = recipientRepository.findById(account.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipient not found"));

        modelMapper.map(dto, recipient); // chỉ map các trường RecipientUpdateDTO -> Recipient
        recipientRepository.save(recipient);
    }
}

