package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.request.ReportRequest;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.Appointment;
import com.swp.blooddonation.entity.Report;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.AppointmentRepository;
import com.swp.blooddonation.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReportService {
    @Autowired
    ReportRepository reportRepository;
    @Autowired
    AuthenticationService authenticationService;
    @Autowired
    AppointmentRepository appointmentRepository;

    public Report create(ReportRequest reportRequest) {
        Account currentAccount = authenticationService.getCurrentAccount();

        Appointment appointment = appointmentRepository.findById(reportRequest.getAppointmentId())
                .orElseThrow( () -> new BadRequestException("Appointment not found"));

        // check xem appointment nay co phai cua account nay hay ko
        if(appointment.getAccount().getId() != currentAccount.getId()){
            throw new BadRequestException("This appointment is not yours");
        }else{
            Report report = new Report();
            report.setAppointment(appointment);
            report.setAccount(currentAccount);
            report.setReason(reportRequest.getReason());
            report.setCreatedAt(LocalDateTime.now());
            report.setDescription(reportRequest.getDescription());
            return reportRepository.save(report);
        }


    }
}
