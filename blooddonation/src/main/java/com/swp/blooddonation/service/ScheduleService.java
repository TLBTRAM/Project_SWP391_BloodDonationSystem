package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.request.ScheduleRequestDTO;
import com.swp.blooddonation.dto.response.ScheduleResponseDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.Schedule;
import com.swp.blooddonation.enums.ScheduleStatus;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final AuthenticationService authenticationService;
    private final ModelMapper modelMapper;

    public ScheduleResponseDTO createSchedule(ScheduleRequestDTO request) {
        Account currentUser = authenticationService.getCurrentAccount();

        boolean exists = scheduleRepository.existsByScheduleDate(request.getScheduleDate());
        if (exists) {
            throw new BadRequestException("Schedule for this date already exists.");
        }

        // Map từ DTO sang entity
        Schedule schedule = modelMapper.map(request, Schedule.class);
        schedule.setAccount(currentUser);
        schedule.setStatus(ScheduleStatus.OPEN); // mặc định là OPEN khi tạo mới

        // Lưu vào DB
        Schedule savedSchedule = scheduleRepository.save(schedule);

        // Map lại sang response DTO
        ScheduleResponseDTO response = modelMapper.map(savedSchedule, ScheduleResponseDTO.class);
        String createdBy = currentUser.getFullName();
        if (createdBy == null || createdBy.isEmpty()) {
            createdBy = currentUser.getEmail();
        }
        response.setCreatedBy(createdBy);

        return response;
    }
}