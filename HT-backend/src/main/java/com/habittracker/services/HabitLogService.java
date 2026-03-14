package com.habittracker.services;

import com.habittracker.dto.HabitLogDTO;
import com.habittracker.models.Habit;
import com.habittracker.models.HabitLog;
import com.habittracker.models.User;
import com.habittracker.repositories.HabitLogRepository;
import com.habittracker.repositories.HabitRepository;
import com.habittracker.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HabitLogService {

    private final HabitLogRepository habitLogRepository;
    private final HabitRepository habitRepository;
    private final UserRepository userRepository;

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public HabitLogDTO logHabit(String username, HabitLogDTO dto) {
        User user = getUser(username);
        Habit habit = habitRepository.findByIdAndUser(dto.getHabitId(), user)
                .orElseThrow(() -> new RuntimeException("Habit not found: " + dto.getHabitId()));

        // Upsert: one log per habit per day
        HabitLog log = habitLogRepository.findByHabitAndDate(habit, dto.getDate())
                .orElse(HabitLog.builder().habit(habit).date(dto.getDate()).build());

        log.setCompleted(dto.getCompleted() != null ? dto.getCompleted() : false);
        log.setNotes(dto.getNotes());

        return toDTO(habitLogRepository.save(log));
    }

    public List<HabitLogDTO> getLogsForHabit(String username, Long habitId) {
        User user = getUser(username);
        Habit habit = habitRepository.findByIdAndUser(habitId, user)
                .orElseThrow(() -> new RuntimeException("Habit not found: " + habitId));
        return habitLogRepository.findByHabitOrderByDateDesc(habit).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private HabitLogDTO toDTO(HabitLog log) {
        HabitLogDTO dto = new HabitLogDTO();
        dto.setId(log.getId());
        dto.setHabitId(log.getHabit().getId());
        dto.setDate(log.getDate());
        dto.setCompleted(log.getCompleted());
        dto.setNotes(log.getNotes());
        return dto;
    }
}
