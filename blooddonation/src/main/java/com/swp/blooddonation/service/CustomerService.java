package com.swp.blooddonation.service;

import com.swp.blooddonation.dto.CustomerDTO;
import com.swp.blooddonation.dto.DonationHistoryDTO;
import com.swp.blooddonation.entity.Account;
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
    private final ModelMapper modelMapper;

    // 1. Lấy hồ sơ Customer
    public CustomerDTO getProfile(Account account) {
        Customer customer = getCustomer(account);
        CustomerDTO dto = modelMapper.map(customer, CustomerDTO.class);
        dto.setFullName(account.getFullName());
        return dto;
    }

    // 2. Lịch sử hiến máu
    public List<DonationHistoryDTO> getDonationHistory(Account account) {
        Customer customer = getCustomer(account);
        return donationHistoryRepository.findByCustomer(customer).stream()
                .map(dh -> modelMapper.map(dh, DonationHistoryDTO.class))
                .collect(Collectors.toList());
    }


    // 3. Gợi ý ngày hiến máu tiếp theo
    public String getDonationRecommendation(Account account) {
        Customer customer = getCustomer(account);
        LocalDate last = customer.getLastDonationDate();
        if (last == null) return "Bạn chưa từng hiến máu. Bạn có thể hiến ngay hôm nay.";

        LocalDate next = last.plusDays(90);
        return next.isAfter(LocalDate.now())
                ? "Bạn có thể hiến máu lại vào ngày: " + next
                : "Bạn đã có thể hiến máu trở lại.";
    }

    // 🔐 Lấy Customer từ Account
    private Customer getCustomer(Account account) {
        return customerRepository.findById(account.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bạn chưa đăng ký thông tin cá nhân"));
    }
}
