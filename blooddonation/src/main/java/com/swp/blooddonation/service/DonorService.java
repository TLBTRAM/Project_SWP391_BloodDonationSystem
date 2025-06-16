package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.DonorDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.Donor;
import com.swp.blooddonation.repository.DonorRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class DonorService {

    private final DonorRepository donorRepository;
//    private final AppointmentRepository appointmentRepository;
//    private final DonationHistoryRepository donationHistoryRepository;
    private final ModelMapper modelMapper;

    // ✅ 1. Lấy hồ sơ Donor
    public DonorDTO getProfile(Account account) {
        Donor donor = donorRepository.findById(account.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donor not found"));

        DonorDTO dto = modelMapper.map(donor, DonorDTO.class);
        dto.setFullName(account.getFullName()); // do fullName nằm trong Account
        return dto;
    }

/*

    public void bookAppointment(Account account, AppointmentRequestDTO dto) {
        Appointment appointment = modelMapper.map(dto, Appointment.class);
        appointment.setDonor(account);
        appointment.setStatus(AppointmentStatus.PENDING);
        appointmentRepository.save(appointment);
    }

    // ✅ 4. Lấy danh sách lịch hẹn
    public List<AppointmentDTO> getAppointments(Account account) {
        return appointmentRepository.findByDonor(account).stream()
                .map(app -> modelMapper.map(app, AppointmentDTO.class))
                .collect(Collectors.toList());
    }

    // ✅ 5. Hủy lịch hẹn
    public void cancelAppointment(Account account, Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));

        if (!appointment.getDonor().getId().equals(account.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không thể hủy lịch của người khác");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    // ✅ 6. Lịch sử hiến máu
    public List<DonationHistoryDTO> getDonationHistory(Account account) {
        return donationHistoryRepository.findByDonor(account).stream()
                .map(dh -> modelMapper.map(dh, DonationHistoryDTO.class))
                .collect(Collectors.toList());
    }

    // ✅ 7. Gợi ý lịch hiến máu tiếp theo
    public String getDonationRecommendation(Account account) {
        Donor donor = donorRepository.findById(account.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Donor not found"));

        LocalDate last = donor.getLastDonationDate();
        if (last == null) return "Bạn chưa từng hiến máu. Bạn có thể hiến ngay hôm nay.";

        LocalDate next = last.plusDays(90);
        return next.isAfter(LocalDate.now())
                ? "Bạn có thể hiến máu lại vào ngày: " + next
                : "Bạn đã có thể hiến máu trở lại.";
    }


 */
}
