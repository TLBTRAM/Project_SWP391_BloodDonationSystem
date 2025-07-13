package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.TestResultDTO;
import com.swp.blooddonation.entity.*;
import com.swp.blooddonation.repository.UserRepository;
import com.swp.blooddonation.repository.TestResultRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalStaffService {

    private final UserRepository userRepository;
    private final TestResultRepository testResultRepository;
    private final ModelMapper modelMapper;

    // Lấy danh sách tất cả kết quả xét nghiệm do MedicalStaff này thực hiện
    public List<TestResultDTO> getAllTestResults(Account account) {
        User staff = getMedicalStaff(account);
        return testResultRepository.findByStaff(staff).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    //  Lấy chi tiết 1 kết quả xét nghiệm
    public TestResultDTO getTestResultById(Long id) {
        TestResult result = testResultRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Test result not found"));
        return convertToDTO(result);
    }

    private TestResultDTO convertToDTO(TestResult result) {
        TestResultDTO dto = modelMapper.map(result, TestResultDTO.class);
        dto.setCustomerId(result.getCustomer().getId());
        return dto;
    }

    //  Lấy thông tin User tương ứng với Account (phải là MEDICALSTAFF)
    private User getMedicalStaff(Account account) {
        return userRepository.findByAccount(account)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Không phải Medical Staff"));
    }
}
