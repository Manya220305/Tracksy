package com.habittracker.controllers;

import com.habittracker.dto.ProgressResponse;
import com.habittracker.dto.StreakResponse;
import com.habittracker.services.AnalyticsService;
import com.habittracker.services.HabitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AnalyticsService analyticsService;
    private final HabitService habitService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardData(
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        
        ProgressResponse progress = analyticsService.getProgress(username);
        List<StreakResponse> streaks = analyticsService.getStreaks(username);
        
        // Find max current streak
        int maxStreak = streaks.stream()
                .mapToInt(StreakResponse::getCurrentStreak)
                .max()
                .orElse(0);

        Map<String, Object> data = new HashMap<>();
        data.put("totalHabits", progress.getTotalHabits());
        data.put("totalCompletions", progress.getTotalCompletions());
        data.put("currentStreak", maxStreak);
        data.put("overallCompletionRate", progress.getOverallCompletionRate());
        data.put("dailyCompletionRates", progress.getDailyCompletionRates());
        
        return ResponseEntity.ok(data);
    }
}
