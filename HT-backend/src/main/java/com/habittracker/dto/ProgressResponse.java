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
public class ProgressResponse {
    private Map<LocalDate, Double> dailyCompletionRates;
    private double overallCompletionRate;
    private long totalHabits;
    private long totalCompletions;
}
