package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.TestResultDTO;
import com.swp.blooddonation.entity.*;
import com.swp.blooddonation.repository.CustomerRepository;
import com.swp.blooddonation.repository.MedicalStaffRepository;
import com.swp.blooddonation.repository.TestResultRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalStaffService {

    private final MedicalStaffRepository medicalStaffRepository;
    private final CustomerRepository customerRepository;
    private final TestResultRepository testResultRepository;
    private final ModelMapper modelMapper;

    // Lấy danh sách tất cả kết quả xét nghiệm do MedicalStaff này thực hiện
    public List<TestResultDTO> getAllTestResults(Account account) {
        MedicalStaff staff = getMedicalStaff(account);
        return testResultRepository.findByStaff(staff).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    //  Tạo kết quả xét nghiệm mới
    public void createTestResult(Account account, TestResultDTO dto) {
        MedicalStaff staff = getMedicalStaff(account);
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Customer not found"));

        TestResult result = modelMapper.map(dto, TestResult.class);
        result.setTestDate(dto.getTestDate() != null ? dto.getTestDate() : new Date());
        result.setCustomer(customer);
        result.setStaff(staff);
        testResultRepository.save(result);
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

    private TestResult convertToEntity(TestResultDTO dto) {
        TestResult result = modelMapper.map(dto, TestResult.class);
        result.setTestDate(dto.getTestDate() != null ? dto.getTestDate() : new Date());
        return result;
    }

    //  Lấy thông tin MedicalStaff tương ứng với Account
    private MedicalStaff getMedicalStaff(Account account) {
        return medicalStaffRepository.findById(account.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Không phải Medical Staff"));
    }
}
