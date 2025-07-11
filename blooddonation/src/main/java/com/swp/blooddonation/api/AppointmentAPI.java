package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.request.AppointmentRequest;
import com.swp.blooddonation.entity.Appointment;
import com.swp.blooddonation.service.AppointmentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SecurityRequirement(name = "api")
@RequestMapping("/api/appointment/")

public class AppointmentAPI {
    @Autowired
    private AppointmentService appointmentService;

//    @PreAuthorize("hasRole('MEDICALSTAFF')")
//    @PostMapping("/approve/{registerId}")
//    public ResponseEntity<?> approveRegister(@PathVariable Long registerId) {
//        Appointment appointment = appointmentService.approveRegister(registerId);
//        return ResponseEntity.ok(appointment);
//    }



//    @PostMapping
//    public ResponseEntity<Appointment> create(@RequestBody AppointmentRequest appointmentRequest){
//        Appointment appointment = appointmentService.create(appointmentRequest);
//        return ResponseEntity.ok(appointment);
//    }
//
//    @GetMapping("/my-appointments")
//    public ResponseEntity<List<Appointment>> getMyAppointments() {
//        List<Appointment> appointments = appointmentService.getMyAppointments();
//        return ResponseEntity.ok(appointments);
//    }
//
//    @GetMapping("/staff-appointments")
//    public ResponseEntity<List<Appointment>> getStaffAppointments() {
//        List<Appointment> appointments = appointmentService.getStaffAppointments();
//        return ResponseEntity.ok(appointments);
//    }
//
//    @PutMapping("/{id}/cancel")
//    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Long id) {
//        Appointment appointment = appointmentService.cancelAppointment(id);
//        return ResponseEntity.ok(appointment);
//    }
//
    @PreAuthorize("hasRole('MEDICALSTAFF')")
    @PutMapping("/{id}/complete")
    public ResponseEntity<Appointment> completeAppointment(@PathVariable Long id) {
        Appointment appointment = appointmentService.completeAppointment(id);
        return ResponseEntity.ok(appointment);
    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
//        Appointment appointment = appointmentService.findById(id);
//        return ResponseEntity.ok(appointment);
//    }
//
//    // Medical staff approve appointment
//    @PutMapping("/{id}/approve")
//    public ResponseEntity<Appointment> approveAppointment(@PathVariable Long id) {
//        Appointment appointment = appointmentService.approveAppointment(id);
//        return ResponseEntity.ok(appointment);
//    }
//
//    // Medical staff reject appointment
//    @PutMapping("/{id}/reject")
//    public ResponseEntity<Appointment> rejectAppointment(@PathVariable Long id) {
//        Appointment appointment = appointmentService.rejectAppointment(id);
//        return ResponseEntity.ok(appointment);
//    }
//
//    @PreAuthorize("hasRole('MEDICALSTAFF')")
//    @PutMapping("/{id}/collect")
//    public ResponseEntity<Appointment> collect(@PathVariable Long id) {
//        Appointment appointment = appointmentService.collectBlood(id);
//        return ResponseEntity.ok(appointment);
//    }
}
