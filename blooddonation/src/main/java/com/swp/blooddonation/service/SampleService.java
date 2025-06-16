package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.SampleRequestDTO;
import com.swp.blooddonation.entity.Donor;
import com.swp.blooddonation.entity.Sample;
import com.swp.blooddonation.repository.DonorRepository;
import com.swp.blooddonation.repository.SampleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SampleService {

    private final SampleRepository sampleRepository;
    private final DonorRepository donorRepository;

    public Sample createSample(SampleRequestDTO dto) {
        Donor donor = donorRepository.findById(dto.getDonorId())
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        Sample sample = new Sample();
        sample.setSampleDate(dto.getSampleDate());
        sample.setTotalVolume(dto.getTotalVolume());
        sample.setStorageLocation(dto.getStorageLocation());
        sample.setNote(dto.getNote());
        sample.setDonor(donor);

        return sampleRepository.save(sample);
    }
}
