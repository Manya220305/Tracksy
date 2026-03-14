package com.habittracker.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class HabitDTO {
    private Long id;

    @NotBlank(message = "Habit name is required")
    private String name;

    private String description;
    private String category;
    private String frequency;
    private String difficulty;
}
