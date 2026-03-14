package com.habittracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsightsResponse {
    private Map<String, Double> habitSuccessRates;
    private String mostConsistentHabit;
    private String leastConsistentHabit;
    private double averageCompletionRate;
}
