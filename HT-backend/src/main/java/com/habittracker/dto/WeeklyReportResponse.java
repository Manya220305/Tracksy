package com.habittracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyReportResponse {
    private int totalCompleted;
    private double averageCompletionRate;
    private String mostConsistentHabit;
    private Map<LocalDate, Double> dailyBreakdown;
    private LocalDate startDate;
    private LocalDate endDate;
}
