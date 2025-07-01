package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.BloodRequestDTO;
import com.swp.blooddonation.dto.CustomerDTO;
import com.swp.blooddonation.dto.DonationHistoryDTO;
import com.swp.blooddonation.entity.Account;
import com.swp.blooddonation.entity.BloodRequest;
import com.swp.blooddonation.entity.Customer;
import com.swp.blooddonation.entity.DonationHistory;
import com.swp.blooddonation.repository.BloodRequestRepository;
import com.swp.blooddonation.repository.CustomerRepository;
import com.swp.blooddonation.repository.DonationHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final DonationHistoryRepository donationHistoryRepository;
    private final BloodRequestRepository bloodRequestRepository;
    private final ModelMapper modelMapper;

    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_APPROVED = "APPROVED";
    public static final String STATUS_REJECTED = "REJECTED";

    // ✅ 1. Lấy hồ sơ Customer
    public CustomerDTO getProfile(Account account) {
        Customer customer = getCustomer(account);
        CustomerDTO dto = modelMapper.map(customer, CustomerDTO.class);
        dto.setFullName(account.getFullName());
        return dto;
    }

    // ✅ 2. Lịch sử hiến máu
    public List<DonationHistoryDTO> getDonationHistory(Account account) {
        Customer customer = getCustomer(account);
        return donationHistoryRepository.findByCustomer(customer).stream()
                .map(dh -> modelMapper.map(dh, DonationHistoryDTO.class))
                .collect(Collectors.toList());
    }


    // ✅ 3. Gợi ý ngày hiến máu tiếp theo
    public String getDonationRecommendation(Account account) {
        Customer customer = getCustomer(account);
        LocalDate last = customer.getLastDonationDate();
        if (last == null) return "Bạn chưa từng hiến máu. Bạn có thể hiến ngay hôm nay.";

        LocalDate next = last.plusDays(90);
        return next.isAfter(LocalDate.now())
                ? "Bạn có thể hiến máu lại vào ngày: " + next
                : "Bạn đã có thể hiến máu trở lại.";
    }
    // ✅ 4. Tạo yêu cầu nhận máu
    public void createBloodRequest(Account account, BloodRequestDTO dto) {
        BloodRequest request = new BloodRequest();
        request.setRequestDate(java.time.LocalDateTime.now());
        request.setRequestedBloodType(dto.getBloodTypeNeeded());
        request.setAmount(dto.getAmount() != null ? dto.getAmount() : 1);
        request.setCustomer(account.getCustomer());
        request.setHospital(dto.getHospitalName());
        request.setStatus(STATUS_PENDING);
        request.setMedicalStaff(null);
        bloodRequestRepository.save(request);
    }

    // ✅ 5. Lấy yêu cầu nhận máu
    public List<BloodRequestDTO> getMyBloodRequests(Account account) {
        Customer customer = getCustomer(account);
        return bloodRequestRepository.findByCustomer(customer).stream()
                .map(req -> {
                    BloodRequestDTO dto = modelMapper.map(req, BloodRequestDTO.class);
                    dto.setCustomerId(req.getCustomer().getId());
                    dto.setStatus(req.getStatus());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Hủy yêu cầu nhận máu
    public void cancelRequest(Account account, Long requestId) {
        Customer customer = getCustomer(account);
        BloodRequest request = bloodRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy yêu cầu"));

        if (!request.getCustomer().getId().equals(customer.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không thể hủy yêu cầu của người khác");
        }

        bloodRequestRepository.delete(request);
    }

    public void approveBloodRequest(Account staff, Long id) {
        if(!staff.getRole().equals(com.swp.blooddonation.enums.Role.MEDICALSTAFF))
            throw new com.swp.blooddonation.exception.exceptions.BadRequestException("Only medical staff can approve requests");
        BloodRequest request = bloodRequestRepository.findById(id).orElseThrow(() -> new com.swp.blooddonation.exception.exceptions.BadRequestException("Request not found"));
        if(!STATUS_PENDING.equals(request.getStatus()))
            throw new com.swp.blooddonation.exception.exceptions.BadRequestException("Only pending requests can be approved");
        request.setStatus(STATUS_APPROVED);
        request.setMedicalStaff(staff);
        bloodRequestRepository.save(request);
    }

    public void rejectBloodRequest(Account staff, Long id) {
        if(!staff.getRole().equals(com.swp.blooddonation.enums.Role.MEDICALSTAFF))
            throw new com.swp.blooddonation.exception.exceptions.BadRequestException("Only medical staff can reject requests");
        BloodRequest request = bloodRequestRepository.findById(id).orElseThrow(() -> new com.swp.blooddonation.exception.exceptions.BadRequestException("Request not found"));
        if(!STATUS_PENDING.equals(request.getStatus()))
            throw new com.swp.blooddonation.exception.exceptions.BadRequestException("Only pending requests can be rejected");
        request.setStatus(STATUS_REJECTED);
        request.setMedicalStaff(staff);
        bloodRequestRepository.save(request);
    }

    // 🔐 Lấy Customer từ Account
    private Customer getCustomer(Account account) {
        return customerRepository.findById(account.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bạn chưa đăng ký thông tin cá nhân"));
    }
}
