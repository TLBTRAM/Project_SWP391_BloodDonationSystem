package com.swp.blooddonation.config;

import com.swp.blooddonation.dto.TestResultResponseDTO;
import com.swp.blooddonation.entity.TestResult;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper(){
        ModelMapper modelMapper = new ModelMapper();

        TypeMap<TestResult, TestResultResponseDTO> typeMap = modelMapper.createTypeMap(TestResult.class, TestResultResponseDTO.class);

        typeMap.addMappings(mapper -> {
            mapper.map(TestResult::isHiv, TestResultResponseDTO::setHiv);
            mapper.map(TestResult::isHbv, TestResultResponseDTO::setHbv);
            mapper.map(TestResult::isHcv, TestResultResponseDTO::setHcv);
            mapper.map(TestResult::isSyphilis, TestResultResponseDTO::setSyphilis);
            mapper.map(src -> src.getSample().getId(), TestResultResponseDTO::setSampleId);
            mapper.map(src -> src.getTestedBy().getAccount().getFullName(), TestResultResponseDTO::setTestedByStaffName);
            mapper.map(src -> src.getSample().getDonor().getAccount().getFullName(), TestResultResponseDTO::setDonorName);
        });

        return modelMapper;
    }

}
