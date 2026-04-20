package com.habittracker.services;

import com.habittracker.dto.HabitDTO;
import com.habittracker.models.Habit;
import com.habittracker.models.NotificationType;
import com.habittracker.models.User;
import com.habittracker.repositories.HabitRepository;
import com.habittracker.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service handling habit-related business logic.
 * 
 * SYSTEM DESIGN NOTE (Controller -> Service -> DB):
 * This service layer isolates the core business logic from the web layer.
 * Controllers simply pass DTOs here, and this service interacts with the Repositories
 * to mutate the state. This makes logic highly reusable and testable independently
 * of HTTP requests.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class HabitService {

    private final HabitRepository habitRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<HabitDTO> getAllHabits(String username) {
        User user = getUser(username);
        return habitRepository.findAllByUser(user).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @CacheEvict(value = {"dashboard", "analytics", "streaks", "progress", "insights"}, allEntries = true)
    public HabitDTO createHabit(String username, HabitDTO dto) {
        User user = getUser(username);
        Habit habit = Habit.builder()
                .user(user)
                .name(dto.getName())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .frequency(dto.getFrequency() != null ? dto.getFrequency() : "Daily")
                .difficulty(dto.getDifficulty() != null ? dto.getDifficulty() : "Medium")
                .scheduledTime(dto.getScheduledTime() != null ? LocalTime.parse(dto.getScheduledTime()) : null)
                .build();
        Habit saved = habitRepository.save(habit);
        notificationService.createNotification(user, "New habit created: " + saved.getName(), NotificationType.SYSTEM);
        log.info("Habit created successfully for user {}: {}", username, saved.getName());
        return toDTO(saved);
    }

    @CacheEvict(value = {"dashboard", "analytics", "streaks", "progress", "insights"}, allEntries = true)
    public HabitDTO updateHabit(String username, Long id, HabitDTO dto) {
        User user = getUser(username);
        Habit habit = habitRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Habit not found with id: " + id));

        if (dto.getName() != null) habit.setName(dto.getName());
        if (dto.getDescription() != null) habit.setDescription(dto.getDescription());
        if (dto.getCategory() != null) habit.setCategory(dto.getCategory());
        if (dto.getFrequency() != null) habit.setFrequency(dto.getFrequency());
        if (dto.getDifficulty() != null) habit.setDifficulty(dto.getDifficulty());
        if (dto.getScheduledTime() != null) {
            habit.setScheduledTime(LocalTime.parse(dto.getScheduledTime()));
        }

        log.info("Habit id: {} updated successfully for user {}", id, username);
        return toDTO(habitRepository.save(habit));
    }

    @Transactional
    @CacheEvict(value = {"dashboard", "analytics", "streaks", "progress", "insights"}, allEntries = true)
    public void deleteHabit(String username, Long id) {
        User user = getUser(username);
        Habit habit = habitRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Habit not found with id: " + id));
        log.info("Deleting habit with id: {} for user: {}", id, username);
        System.out.println("Deleting habit with id: " + id);
        habitRepository.delete(habit);
    }

    @CacheEvict(value = {"dashboard", "analytics", "streaks", "progress", "insights"}, allEntries = true)
    public void toggleHabitToday(String username, Long id) {
        User user = getUser(username);
        Habit habit = habitRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Habit not found with id: " + id));

        java.time.LocalDate today = java.time.LocalDate.now();
        com.habittracker.models.HabitLog habitLog = habit.getLogs().stream()
                .filter(l -> l.getDate().equals(today))
                .findFirst()
                .orElse(null);

        if (habitLog == null) {
            habitLog = com.habittracker.models.HabitLog.builder()
                    .habit(habit)
                    .date(today)
                    .completed(true)
                    .build();
            habit.getLogs().add(habitLog);
        } else {
            habitLog.setCompleted(!habitLog.getCompleted());
        }
        habitRepository.save(habit);
        log.info("Habit id: {} toggled today for user {}. New status: {}", id, username, habitLog.getCompleted());
    }

    private HabitDTO toDTO(Habit habit) {
        HabitDTO dto = new HabitDTO();
        dto.setId(habit.getId());
        dto.setName(habit.getName());
        dto.setDescription(habit.getDescription());
        dto.setCategory(habit.getCategory());
        dto.setFrequency(habit.getFrequency());
        dto.setDifficulty(habit.getDifficulty());
        if (habit.getScheduledTime() != null) {
            dto.setScheduledTime(habit.getScheduledTime().toString());
        }
        return dto;
    }
}
