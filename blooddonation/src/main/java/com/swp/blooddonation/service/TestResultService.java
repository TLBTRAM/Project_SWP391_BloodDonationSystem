package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.TestResultRequestDTO;
import com.swp.blooddonation.dto.TestResultResponseDTO;
import com.swp.blooddonation.entity.BloodSample;
import com.swp.blooddonation.entity.MedicalStaff;
import com.swp.blooddonation.entity.TestResult;
import com.swp.blooddonation.repository.BloodSampleRepository;
import com.swp.blooddonation.repository.MedicalStaffRepository;
import com.swp.blooddonation.repository.TestResultRepository;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class TestResultService {

    @Autowired
    private TestResultRepository testResultRepo;

    @Autowired
    private BloodSampleRepository bloodSampleRepo;

    @Autowired
    private MedicalStaffRepository medicalStaffRepo;

    private final ModelMapper modelMapper;

    public TestResultService(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public TestResult performTest(Long sampleId, Long staffId, @Valid TestResultRequestDTO testResultData) {
        BloodSample sample = bloodSampleRepo.findById(sampleId)
                .orElseThrow(() -> new RuntimeException("Sample not found"));
        MedicalStaff staff = medicalStaffRepo.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        // Mapping từ DTO sang Entity
        TestResult result = modelMapper.map(testResultData, TestResult.class);

        // Bổ sung các trường không có trong DTO
        result.setSample(sample);
        result.setTestedBy(staff);
        result.setTestDate(LocalDate.now());

        // Cập nhật trạng thái mẫu
        sample.setStatus("Tested");
        bloodSampleRepo.save(sample);

        return testResultRepo.save(result);
    }

    public TestResultResponseDTO mapToResponse(TestResult result) {
        return modelMapper.map(result, TestResultResponseDTO.class);
    }

}