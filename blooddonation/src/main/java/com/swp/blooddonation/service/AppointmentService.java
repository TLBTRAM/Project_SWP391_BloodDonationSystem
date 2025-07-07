package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.request.AppointmentRequest;
import com.swp.blooddonation.entity.*;
//import com.swp.blooddonation.entity.MedicineService;
import com.swp.blooddonation.enums.AppointmentEnum;
import com.swp.blooddonation.enums.BloodTestStatus;
import com.swp.blooddonation.enums.RegisterStatus;
import com.swp.blooddonation.enums.Role;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.*;
import jakarta.transaction.Transactional;
import javassist.NotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {
    
    @Autowired
    AppointmentRepository appointmentRepository;

    @Autowired
    AccountSlotRepository accountSlotRepository;

    @Autowired
    AuthenticationReponsitory authenticationReponsitory;

    @Autowired
    AuthenticationService authenticationService;

    @Autowired
    BloodTestRepository bloodTestRepository;

    @Autowired
    SlotRepository slotRepository;

    @Autowired
    EmailService emailService;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    RegisterRepository registerRepository;

    @Autowired
    ModelMapper modelMapper;




}
