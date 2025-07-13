package com.swp.blooddonation.api;

import com.swp.blooddonation.dto.request.FeedbackRequest;
import com.swp.blooddonation.entity.Feedback;
import com.swp.blooddonation.service.FeedbackService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SecurityRequirement(name = "api")
@RequestMapping("/api/feedback")
public class FeedbackAPI {
    @Autowired
    private FeedbackService feedbackService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity createFeedback(FeedbackRequest feedbackRequest) {
        Feedback newFeedback = feedbackService.create(feedbackRequest);
        return ResponseEntity.ok(newFeedback);

    }
}
