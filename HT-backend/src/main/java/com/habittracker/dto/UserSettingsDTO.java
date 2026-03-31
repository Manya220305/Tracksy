package com.habittracker.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalTime;

@Data
@Builder
public class UserSettingsDTO {
    private String username;
    private String email;
    private boolean reminderEnabled;
    private LocalTime reminderTime;
}
