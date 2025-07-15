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
import org.springframework.scheduling.annotation.Scheduled;
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

    public List<ScheduleResponseDTO> getSchedulesByDate(LocalDate date) {
        List<Schedule> schedules = scheduleRepository.findByScheduleDate(date).stream().toList();
        return schedules.stream()
                .map(s -> modelMapper.map(s, ScheduleResponseDTO.class))
                .toList();
    }

    public List<ScheduleResponseDTO> getSchedulesByMonth(int month, int year) {
        List<Schedule> schedules = scheduleRepository.findByMonthAndYear(month, year);
        return schedules.stream()
                .map(s -> modelMapper.map(s, ScheduleResponseDTO.class))
                .toList();
    }

    public List<ScheduleResponseDTO> getSchedulesByStatus(ScheduleStatus status) {
        List<Schedule> schedules = scheduleRepository.findByStatus(status);
        return schedules.stream()
                .map(s -> modelMapper.map(s, ScheduleResponseDTO.class))
                .toList();
    }

    public List<ScheduleResponseDTO> createSchedulesForMonth(int month, int year) {
        User currentUser = userService.getCurrentUser();
        java.time.YearMonth yearMonth = java.time.YearMonth.of(year, month);
        java.util.List<ScheduleResponseDTO> createdSchedules = new java.util.ArrayList<>();
        for (int day = 1; day <= yearMonth.lengthOfMonth(); day++) {
            LocalDate date = yearMonth.atDay(day);
            if (!scheduleRepository.existsByScheduleDate(date)) {
                Schedule schedule = new Schedule();
                schedule.setScheduleDate(date);
                schedule.setUser(currentUser);
                schedule.setStatus(ScheduleStatus.OPEN);
                Schedule saved = scheduleRepository.save(schedule);
                ScheduleResponseDTO dto = modelMapper.map(saved, ScheduleResponseDTO.class);
                dto.setCreatedBy(saved.getUser().getId());
                createdSchedules.add(dto);
            }
        }
        return createdSchedules;
    }

    public ScheduleResponseDTO closeSchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy schedule với id: " + scheduleId));
        if (schedule.getStatus() != ScheduleStatus.OPEN) {
            throw new BadRequestException("Chỉ có thể đóng schedule đang ở trạng thái OPEN.");
        }
        schedule.setStatus(ScheduleStatus.CLOSED);
        Schedule saved = scheduleRepository.save(schedule);
        ScheduleResponseDTO dto = modelMapper.map(saved, ScheduleResponseDTO.class);
        dto.setCreatedBy(saved.getUser().getId());
        return dto;
    }

    public ScheduleResponseDTO updateScheduleStatus(Long scheduleId, ScheduleStatus status) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy schedule với id: " + scheduleId));
        if (schedule.getStatus() == status) {
            throw new BadRequestException("Schedule đã ở trạng thái " + status + ".");
        }
        schedule.setStatus(status);
        Schedule saved = scheduleRepository.save(schedule);
        ScheduleResponseDTO dto = modelMapper.map(saved, ScheduleResponseDTO.class);
        dto.setCreatedBy(saved.getUser().getId());
        return dto;
    }

    // Đóng các schedule đã qua ngày hôm nay
    @Scheduled(cron = "0 0 0 * * *") // chạy mỗi ngày lúc 0h
    public void closeExpiredSchedules() {
        LocalDate today = LocalDate.now();
        List<Schedule> openSchedules = scheduleRepository.findByStatus(ScheduleStatus.OPEN);
        List<Schedule> toClose = openSchedules.stream()
                .filter(s -> s.getScheduleDate().isBefore(today))
                .toList();
        for (Schedule s : toClose) {
            s.setStatus(ScheduleStatus.CLOSED);
        }
        scheduleRepository.saveAll(toClose);
    }

    public int closeExpiredSchedulesManually() {
        LocalDate today = LocalDate.now();
        List<Schedule> openSchedules = scheduleRepository.findByStatus(ScheduleStatus.OPEN);
        List<Schedule> toClose = openSchedules.stream()
                .filter(s -> s.getScheduleDate().isBefore(today))
                .toList();
        int closedCount = 0;
        for (Schedule s : toClose) {
            if (s.getStatus() == ScheduleStatus.OPEN) {
                s.setStatus(ScheduleStatus.CLOSED);
                closedCount++;
            }
        }
        scheduleRepository.saveAll(toClose);
        return closedCount;
    }
}