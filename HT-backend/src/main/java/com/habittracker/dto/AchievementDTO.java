package com.habittracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchievementDTO {
    private String title;
    private String description;
    private long currentValue;
    private long targetValue;
    private boolean isEarned;
    private LocalDateTime earnedAt;
    private String iconType; // e.g., 'TROPHY', 'TARGET'
    private String color;    // e.g., 'orange', 'blue'
}
