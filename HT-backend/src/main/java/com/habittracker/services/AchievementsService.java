package com.habittracker.services;

import com.habittracker.models.Achievement;
import com.habittracker.models.NotificationType;
import com.habittracker.models.User;
import com.habittracker.repositories.AchievementRepository;
import com.habittracker.repositories.HabitLogRepository;
import com.habittracker.repositories.HabitRepository;
import com.habittracker.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AchievementsService {

    private final AchievementRepository achievementRepository;
    private final HabitLogRepository habitLogRepository;
    private final HabitRepository habitRepository;
    private final UserRepository userRepository;
    private final AnalyticsService analyticsService;
    private final NotificationService notificationService;

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Check and unlock new achievements, then return all earned achievements.
     */
    public List<Achievement> getAndCheckAchievements(String username) {
        User user = getUser(username);
        checkAndUnlock(user);
        return achievementRepository.findAllByUser(user);
    }

    private void unlock(User user, String title, String description) {
        if (!achievementRepository.existsByUserAndTitle(user, title)) {
            achievementRepository.save(Achievement.builder()
                    .user(user)
                    .title(title)
                    .description(description)
                    .earnedAt(LocalDateTime.now())
                    .build());
            
            notificationService.createNotification(user, "Achievement Unlocked: " + title + " 🎉", NotificationType.ACHIEVEMENT);
        }
    }

    private void checkAndUnlock(User user) {
        // Total completions badge
        long totalCompletions = habitLogRepository.countCompletedByUserId(user.getId());
        if (totalCompletions >= 1) {
            unlock(user, "First Completion", "Completed your first habit!");
        }
        if (totalCompletions >= 100) {
            unlock(user, "100 Habit Completions", "Completed 100 habits total!");
        }

        // Total habits badge
        long totalHabits = habitRepository.countByUser(user);
        if (totalHabits >= 5) {
            unlock(user, "Goal Setter", "Tracking 5 or more habits.");
        }

        // Streak-based badges: check max streak across all habits
        analyticsService.getStreaks(username(user)).forEach(s -> {
            if (s.getCurrentStreak() >= 7) {
                unlock(user, "7 Day Streak",
                        "Maintained a 7-day streak on habit: " + s.getHabitName());
            }
            if (s.getLongestStreak() >= 30) {
                unlock(user, "30 Day Consistency",
                        "Achieved a 30-day streak on habit: " + s.getHabitName());
            }
            if (s.getLongestStreak() >= 100) {
                unlock(user, "Century Streak",
                        "Achieved a 100-day streak on habit: " + s.getHabitName());
            }
        });
    }

    private String username(User user) {
        return user.getUsername();
    }
}
