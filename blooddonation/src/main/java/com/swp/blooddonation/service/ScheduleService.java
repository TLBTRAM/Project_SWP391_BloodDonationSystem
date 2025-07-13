package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.request.ScheduleRequestDTO;
import com.swp.blooddonation.dto.response.ScheduleResponseDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.Schedule;
import com.swp.blooddonation.entity.User;
import com.swp.blooddonation.enums.ScheduleStatus;
import com.swp.blooddonation.exception.exceptions.BadRequestException;
import com.swp.blooddonation.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final AuthenticationService authenticationService;
    private final ModelMapper modelMapper;

    @Autowired
    UserService userService;

    public ScheduleResponseDTO createSchedule(ScheduleRequestDTO request) {
        User currentUser = userService.getCurrentUser();

        // Đóng tất cả schedule cũ (OPEN và scheduleDate < ngày mới)
        LocalDate newDate = request.getScheduleDate();
        List<Schedule> openSchedules = scheduleRepository.findAll().stream()
                .filter(s -> s.getStatus() == ScheduleStatus.OPEN && s.getScheduleDate().isBefore(newDate))
                .toList();
        for (Schedule s : openSchedules) {
            s.setStatus(ScheduleStatus.CLOSED);
        }
        scheduleRepository.saveAll(openSchedules);

        boolean exists = scheduleRepository.existsByScheduleDate(request.getScheduleDate());
        if (exists) {
            throw new BadRequestException("Schedule for this date already exists.");
        }

        // Map từ DTO sang entity
        Schedule schedule = modelMapper.map(request, Schedule.class);
        schedule.setUser(currentUser);
        schedule.setStatus(ScheduleStatus.OPEN); // mặc định là OPEN khi tạo mới

        // Lưu vào DB
        Schedule savedSchedule = scheduleRepository.save(schedule);

        // Map lại sang response DTO
        ScheduleResponseDTO response = modelMapper.map(savedSchedule, ScheduleResponseDTO.class);
        response.setCreatedBy(savedSchedule.getUser().getId());

        return response;
    }
}