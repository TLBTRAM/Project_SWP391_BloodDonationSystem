package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.Appointment;
import com.swp.blooddonation.entity.Slot;
import com.swp.blooddonation.entity.User;
import com.swp.blooddonation.enums.AppointmentEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCustomer(User customer); // Đổi từ Account → User
    List<Appointment> findByMedicalStaff(User medicalStaff); // Đổi từ Account → User

    boolean existsByCustomerAndSlotAndAppointmentDate(User customer, Slot slot, LocalDate appointmentDate);

    long countBySlotAndAppointmentDateAndMedicalStaff(Slot slot, LocalDate date, User medicalStaff);

    Optional<Appointment> findByCustomer_IdAndAppointmentDateAndStatus(Long customerId, LocalDate date, AppointmentEnum status);

    int countBySlotAndAppointmentDate(Slot slot, LocalDate date);

    long countByMedicalStaffAndSlotAndAppointmentDate(User medicalStaff, Slot slot, LocalDate appointmentDate);

    long countByCustomerId(Long customerId); // Giữ nguyên nếu vẫn đang dùng ID
}

