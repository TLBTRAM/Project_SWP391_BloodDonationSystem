package com.swp.blooddonation.repository;

import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.Appointment;
import com.swp.blooddonation.entity.Slot;
import com.swp.blooddonation.enums.AppointmentEnum;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByCustomer(Account customer);
    List<Appointment> findByMedicalStaff(Account medicalStaff);
    boolean existsByCustomerAndSlotAndAppointmentDate(Account customer, Slot slot, java.time.LocalDate appointmentDate);
    long countBySlotAndAppointmentDateAndMedicalStaff(Slot slot, LocalDate date, Account medicalStaff);
    Optional<Appointment> findByCustomer_IdAndAppointmentDateAndStatus(Long customerId, LocalDate date, AppointmentEnum status);
    int countBySlotAndAppointmentDate(Slot slot, LocalDate date);

}
