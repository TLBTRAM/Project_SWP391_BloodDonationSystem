//package com.swp.blooddonation.service;
//
//import com.swp.blooddonation.entity.MedicineService;
//import com.swp.blooddonation.repository.MedicineServiceRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class MedicineServicesService {
//
//    @Autowired
//    private MedicineServiceRepository medicineServiceRepository;
//
//    // Get all medicine services
//    public List<MedicineService> getAllMedicineServices() {
//        return medicineServiceRepository.findAll();
//    }
//
//    // Get a single medicine service by ID
//    public Optional<MedicineService> getMedicineServiceById(Long id) {
//        return medicineServiceRepository.findById(id);
//    }
//
//    // Create a new medicine service
//    public MedicineService createMedicineService(MedicineService medicineService) {
//        return medicineServiceRepository.save(medicineService);
//    }
//
//    // Update an existing medicine service
//    public Optional<MedicineService> updateMedicineService(Long id, MedicineService medicineServiceDetails) {
//        return medicineServiceRepository.findById(id).map(existing -> {
//            existing.setName(medicineServiceDetails.getName());
//            existing.setDescription(medicineServiceDetails.getDescription());
//            existing.setPrice(medicineServiceDetails.getPrice());
//            existing.setAvailable(medicineServiceDetails.isAvailable());
//            return medicineServiceRepository.save(existing);
//        });
//    }
//
//    // Delete a medicine service by ID
//    public boolean deleteMedicineService(Long id) {
//        Optional<MedicineService> existing = medicineServiceRepository.findById(id);
//        if (existing.isPresent()) {
//            medicineServiceRepository.deleteById(id);
//            return true;
//        } else {
//            return false;
//        }
//    }
//}
