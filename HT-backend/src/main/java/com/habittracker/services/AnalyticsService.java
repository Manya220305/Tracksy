package com.habittracker.services;

import com.habittracker.dto.InsightsResponse;
import com.habittracker.dto.ProgressResponse;
import com.habittracker.dto.StreakResponse;
import com.habittracker.models.Habit;
import com.habittracker.models.HabitLog;
import com.habittracker.models.User;
import com.habittracker.repositories.HabitLogRepository;
import com.habittracker.repositories.HabitRepository;
import com.habittracker.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;
    private final UserRepository userRepository;

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Returns current and longest streak for EACH habit of the user.
     */
    @Cacheable(value = "streaks", key = "#username")
    public List<StreakResponse> getStreaks(String username) {
        User user = getUser(username);
        List<Habit> habits = habitRepository.findAllByUser(user);

        return habits.stream().map(habit -> {
            List<HabitLog> logs = habitLogRepository
                    .findByHabitAndDateBetweenOrderByDateAsc(habit,
                            LocalDate.now().minusYears(1), LocalDate.now());

            Set<LocalDate> completedDates = logs.stream()
                    .filter(HabitLog::getCompleted)
                    .map(HabitLog::getDate)
                    .collect(Collectors.toSet());

            int currentStreak = 0;
            int longestStreak = 0;
            int tempStreak = 0;

            // Calculating  longest streak
            LocalDate cursor = logs.isEmpty() ? LocalDate.now() :
                    logs.get(0).getDate();
            LocalDate end = LocalDate.now();
            while (!cursor.isAfter(end)) {
                if (completedDates.contains(cursor)) {
                    tempStreak++;
                    longestStreak = Math.max(longestStreak, tempStreak);
                } else {
                    tempStreak = 0;
                }
                cursor = cursor.plusDays(1);
            }

            // Calculate current streak (backwards from today)
            LocalDate day = LocalDate.now();
            while (completedDates.contains(day)) {
                currentStreak++;
                day = day.minusDays(1);
            }

            return StreakResponse.builder()
                    .habitName(habit.getName())
                    .currentStreak(currentStreak)
                    .longestStreak(longestStreak)
                    .build();
        }).collect(Collectors.toList());
    }

    /**
     * Daily completion percentage for the last 30 days.
     */
    @Cacheable(value = "progress", key = "#username")
    public ProgressResponse getProgress(String username) {
        User user = getUser(username);
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(29);

        List<HabitLog> logs = habitLogRepository.findByUserIdAndDateRange(user.getId(), start, end);
        long totalHabits = habitRepository.countByUser(user);
        long totalCompletions = habitLogRepository.countCompletedByUserId(user.getId());

        Map<LocalDate, Long> completedPerDay = logs.stream()
                .filter(HabitLog::getCompleted)
                .collect(Collectors.groupingBy(HabitLog::getDate, Collectors.counting()));

        Map<LocalDate, Long> totalPerDay = logs.stream()
                .collect(Collectors.groupingBy(HabitLog::getDate, Collectors.counting()));

        Map<LocalDate, Double> dailyRates = new LinkedHashMap<>();
        LocalDate d = start;
        while (!d.isAfter(end)) {
            long completed = completedPerDay.getOrDefault(d, 0L);
            long total = totalPerDay.getOrDefault(d, totalHabits > 0 ? totalHabits : 1L);
            dailyRates.put(d, total == 0 ? 0.0 : (completed * 100.0 / total));
            d = d.plusDays(1);
        }

        double overall = logs.isEmpty() ? 0 :
                (logs.stream().filter(HabitLog::getCompleted).count() * 100.0 / logs.size());

        return ProgressResponse.builder()
                .dailyCompletionRates(dailyRates)
                .overallCompletionRate(Math.round(overall * 10.0) / 10.0)
                .totalHabits(totalHabits)
                .totalCompletions(totalCompletions)
                .build();
    }

    /**
     * Per-habit success rates, most/least consistent habits.
     */
    @Cacheable(value = "insights", key = "#username")
    public InsightsResponse getInsights(String username) {
        User user = getUser(username);
        List<Habit> habits = habitRepository.findAllByUser(user);

        Map<String, Double> successRates = new LinkedHashMap<>();
        String mostConsistent = null;
        String leastConsistent = null;
        double maxRate = -1;
        double minRate = 101;

        for (Habit habit : habits) {
            List<HabitLog> logs = habitLogRepository.findByHabitOrderByDateDesc(habit);
            if (logs.isEmpty()) {
                successRates.put(habit.getName(), 0.0);
                continue;
            }
            long completed = logs.stream().filter(HabitLog::getCompleted).count();
            double rate = completed * 100.0 / logs.size();
            double rounded = Math.round(rate * 10.0) / 10.0;
            successRates.put(habit.getName(), rounded);

            if (rounded > maxRate) { maxRate = rounded; mostConsistent = habit.getName(); }
            if (rounded < minRate) { minRate = rounded; leastConsistent = habit.getName(); }
        }

        double avg = successRates.values().stream()
                .mapToDouble(Double::doubleValue).average().orElse(0.0);

        return InsightsResponse.builder()
                .habitSuccessRates(successRates)
                .mostConsistentHabit(mostConsistent)
                .leastConsistentHabit(leastConsistent)
                .averageCompletionRate(Math.round(avg * 10.0) / 10.0)
                .build();
    }
}
