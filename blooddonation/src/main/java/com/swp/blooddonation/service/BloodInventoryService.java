package com.swp.blooddonation.service;

import com.swp.blooddonation.entity.BloodInventory;
import com.swp.blooddonation.repository.BloodInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BloodInventoryService {

    @Autowired
    private BloodInventoryRepository bloodInventoryRepo;

    public List<BloodInventory> getAllInventories() {
        return bloodInventoryRepo.findAll();
    }

    public BloodInventory getInventoryByType(String bloodType) {
        return bloodInventoryRepo.findById(bloodType)
                .orElseThrow(() -> new RuntimeException("Blood type not found"));
    }
}