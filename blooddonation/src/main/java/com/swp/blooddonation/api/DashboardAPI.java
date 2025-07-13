package com.swp.blooddonation.api;

import com.swp.blooddonation.service.AccountService;
import com.swp.blooddonation.service.BloodUnitService;
import com.swp.blooddonation.service.AppointmentService;
import com.swp.blooddonation.service.NotificationService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@SecurityRequirement(name = "api")
@RequiredArgsConstructor
public class DashboardAPI {
    private final AccountService accountService;
    private final BloodUnitService bloodUnitService;
    private final AppointmentService appointmentService;
    private final NotificationService notificationService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public Map<String, Object> getDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> result = new HashMap<>();
        String email = userDetails.getUsername();
        Long userId = accountService.getIdByEmail(email);
        String role = accountService.getRoleById(userId);
        if (role != null && (role.equals("ADMIN") || role.equals("MANAGER"))) {
            result.put("totalUsers", accountService.countAll());
            result.put("totalDonations", bloodUnitService.countAll());
            result.put("totalAppointments", appointmentService.countAll());
            result.put("totalNotifications", notificationService.countAll());
            result.put("totalBloodUnits", bloodUnitService.countAllUnits());
        } else {
            result.put("myDonations", bloodUnitService.countByUserId(userId));
            result.put("myAppointments", appointmentService.countByUserId(userId));
            result.put("myNotifications", notificationService.countByUserId(userId));
            result.put("myBloodUnits", bloodUnitService.countUnitsByUserId(userId));
            result.put("myProfile", accountService.getProfile(userId));
        }
        return result;
    }
} 