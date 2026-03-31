package com.habittracker.services;

import com.habittracker.dto.HabitLogDTO;
import com.habittracker.dto.StreakResponse;
import com.habittracker.models.Habit;
import com.habittracker.models.HabitLog;
import com.habittracker.models.NotificationType;
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
    private final NotificationService notificationService;
    private final AnalyticsService analyticsService;

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

        HabitLog savedLog = habitLogRepository.save(log);

        if (Boolean.TRUE.equals(dto.getCompleted())) {
            // Check streak after completing
            List<StreakResponse> streaks = analyticsService.getStreaks(username);
            streaks.stream()
                .filter(s -> s.getHabitName().equals(habit.getName()))
                .findFirst()
                .ifPresent(streak -> {
                    int days = streak.getCurrentStreak();
                    // Alert on milestone streaks
                    if (days == 3 || days == 5 || days == 7 || days == 10 || days == 14 || days == 21 || days == 30 || days == 50 || days == 100) {
                        notificationService.createNotification(user, 
                            "🔥 " + days + "-day streak on " + habit.getName() + "!", 
                            NotificationType.STREAK);
                    }
                });
        }

        return toDTO(savedLog);
    }

    public List<HabitLogDTO> getLogsForHabit(String username, Long habitId, Integer month, Integer year) {
        User user = getUser(username);
        Habit habit = habitRepository.findByIdAndUser(habitId, user)
                .orElseThrow(() -> new RuntimeException("Habit not found: " + habitId));
        
        if (month != null && year != null) {
            java.time.LocalDate start = java.time.LocalDate.of(year, month, 1);
            java.time.LocalDate end = start.with(java.time.temporal.TemporalAdjusters.lastDayOfMonth());
            return habitLogRepository.findByHabitAndDateBetweenOrderByDateAsc(habit, start, end).stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        }
        
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
