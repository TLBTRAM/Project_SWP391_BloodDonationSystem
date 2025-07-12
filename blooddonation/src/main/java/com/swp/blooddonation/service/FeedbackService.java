package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.request.FeedbackRequest;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.Appointment;
import com.swp.blooddonation.entity.Feedback;
import com.swp.blooddonation.entity.User;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.AppointmentRepository;
import com.swp.blooddonation.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class FeedbackService {
    @Autowired
    FeedbackRepository feedbackRepository;
    @Autowired
    AuthenticationService authenticationService;
    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    UserService userService;

    public Feedback create(FeedbackRequest feedbackRequest) {
        User currentUser = userService.getCurrentUser();


        Appointment appointment = appointmentRepository.findById(feedbackRequest.getAppointmentId())
                .orElseThrow(() -> new BadRequestException("Appointment not found"));

        // check xem appointment nay co phai cua account nay hay ko
        if (appointment.getCustomer().getId() != currentUser.getId()) {
            throw new BadRequestException("This appointment is not yours");
        } else {
            Feedback feedback = new Feedback();
            feedback.setAppointment(appointment);
            feedback.setUser(currentUser);
            feedback.setReason(feedback.getReason());
            feedback.setCreatedAt(LocalDateTime.now());
            feedback.setDescription(feedback.getDescription());
            return feedbackRepository.save(feedback);
        }
    }
}
