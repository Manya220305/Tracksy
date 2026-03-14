package com.habittracker.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class HabitLogDTO {
    private Long id;

    @NotNull(message = "Habit ID is required")
    private Long habitId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private Boolean completed = false;
    private String notes;
}
