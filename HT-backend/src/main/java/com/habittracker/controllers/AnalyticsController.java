package com.habittracker.controllers;

import com.habittracker.dto.WeeklyReportResponse;
import com.habittracker.dto.InsightsResponse;
import com.habittracker.dto.ProgressResponse;
import com.habittracker.dto.StreakResponse;
import com.habittracker.services.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/streak")
    public ResponseEntity<List<StreakResponse>> getStreaks(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(analyticsService.getStreaks(userDetails.getUsername()));
    }

    @GetMapping("/progress")
    public ResponseEntity<ProgressResponse> getProgress(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(analyticsService.getProgress(userDetails.getUsername()));
    }

    @GetMapping("/insights")
    public ResponseEntity<InsightsResponse> getInsights(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(analyticsService.getInsights(userDetails.getUsername()));
    }

    @GetMapping("/weekly-report")
    public ResponseEntity<WeeklyReportResponse> getWeeklyReport(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(analyticsService.getWeeklyReport(userDetails.getUsername()));
    }
}
