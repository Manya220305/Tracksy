package com.habittracker.services;

import com.habittracker.dto.AchievementDTO;
import com.habittracker.dto.StreakResponse;
import com.habittracker.models.Achievement;
import com.habittracker.models.NotificationType;
import com.habittracker.models.User;
import com.habittracker.repositories.AchievementRepository;
import com.habittracker.repositories.HabitLogRepository;
import com.habittracker.repositories.HabitRepository;
import com.habittracker.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AchievementsService {

    private final AchievementRepository achievementRepository;
    private final HabitLogRepository habitLogRepository;
    private final HabitRepository habitRepository;
    private final UserRepository userRepository;
    private final AnalyticsService analyticsService;
    private final NotificationService notificationService;

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    public List<AchievementDTO> getAndCheckAchievements(String username) {
        User user = getUser(username);
        checkAndUnlock(user);
        
        List<Achievement> earned = achievementRepository.findAllByUser(user);
        Map<String, Achievement> earnedMap = earned.stream()
                .collect(Collectors.toMap(Achievement::getTitle, a -> a));

        List<AchievementDTO> allBadges = new ArrayList<>();
        
        long totalCompletions = habitLogRepository.countCompletedByUserId(user.getId());
        long totalHabits = habitRepository.countByUser(user);
        List<StreakResponse> streaks = analyticsService.getStreaks(username);
        int maxCurrentStreak = streaks.stream().mapToInt(StreakResponse::getCurrentStreak).max().orElse(0);
        int maxLongestStreak = streaks.stream().mapToInt(StreakResponse::getLongestStreak).max().orElse(0);

        // --- Milestone Categories ---

        // 1. Beginner & Start
        allBadges.add(createDTO("First Steps", "Completed your first habit!", 1, totalCompletions, "TROPHY", "blue", earnedMap));
        allBadges.add(createDTO("Early Bird", "Tracking 3 or more habits.", 3, totalHabits, "TARGET", "cyan", earnedMap));
        allBadges.add(createDTO("On Fire", "Achieve a 3-day streak.", 3, maxCurrentStreak, "FLAME", "orange", earnedMap));
        allBadges.add(createDTO("Habitual", "Completed 10 habits total!", 10, totalCompletions, "STAR", "green", earnedMap));
        
        // 2. Consistency (Streaks)
        allBadges.add(createDTO("Weekly Warrior", "Maintain a 7-day streak.", 7, maxCurrentStreak, "FLAME", "pink", earnedMap));
        allBadges.add(createDTO("Monthly Master", "Achieve a 30-day streak.", 30, maxLongestStreak, "CALENDAR", "indigo", earnedMap));
        allBadges.add(createDTO("Unstoppable", "Achieve a 60-day streak.", 60, maxLongestStreak, "AWARD", "purple", earnedMap));
        allBadges.add(createDTO("Consistency King", "Achieve a 100-day streak.", 100, maxLongestStreak, "TROPHY", "yellow", earnedMap));
        allBadges.add(createDTO("Life Changer", "Achieve a 180-day streak.", 180, maxLongestStreak, "SHIELD", "emerald", earnedMap));
        allBadges.add(createDTO("Legendary", "Maintain a streak for an entire year (365 days)!", 365, maxLongestStreak, "CROWN", "amber", earnedMap));

        // 3. Productivity (Total Volume)
        allBadges.add(createDTO("Dedicated", "Completed 100 habits total!", 100, totalCompletions, "AWARD", "purple", earnedMap));
        allBadges.add(createDTO("Goal Getter", "Completed 250 habits total!", 250, totalCompletions, "CHECK_CIRCLE", "blue", earnedMap));
        allBadges.add(createDTO("Productivity Pro", "Completed 500 habits total!", 500, totalCompletions, "ZAP", "yellow", earnedMap));
        allBadges.add(createDTO("Habit Legend", "Completed 1,000 habits total!", 1000, totalCompletions, "TROPHY", "rose", earnedMap));

        // 4. Architect (Complexity)
        allBadges.add(createDTO("Architect", "Tracking 5 or more habits.", 5, totalHabits, "LAYOUT", "indigo", earnedMap));
        allBadges.add(createDTO("Master Architect", "Tracking 10 or more habits.", 10, totalHabits, "BRIEFCASE", "violet", earnedMap));
        allBadges.add(createDTO("Empire Builder", "Tracking 20 habits. You're unstoppable!", 20, totalHabits, "HEXAGON", "slate", earnedMap));

        // 5. Skill
        boolean isPerfect = hasPerfectWeek(user);
        allBadges.add(createDTO("Perfect Week", "100% completion rate for 7 consecutive days.", 1, isPerfect ? 1 : 0, "SPARKLES", "fuchsia", earnedMap));

        return allBadges;
    }

    private AchievementDTO createDTO(String title, String desc, long target, long current, String icon, String color, Map<String, Achievement> earnedMap) {
        Achievement earned = earnedMap.get(title);
        return AchievementDTO.builder()
                .title(title)
                .description(desc)
                .targetValue(target)
                .currentValue(Math.min(current, target))
                .isEarned(earned != null)
                .earnedAt(earned != null ? earned.getEarnedAt() : null)
                .iconType(icon)
                .color(color)
                .build();
    }

    @Transactional
    public void checkAndUnlock(User user) {
        long totalCompletions = habitLogRepository.countCompletedByUserId(user.getId());
        long totalHabits = habitRepository.countByUser(user);
        List<StreakResponse> streaks = analyticsService.getStreaks(user.getUsername());
        int maxCurrentStreak = streaks.stream().mapToInt(StreakResponse::getCurrentStreak).max().orElse(0);
        int maxLongestStreak = streaks.stream().mapToInt(StreakResponse::getLongestStreak).max().orElse(0);

        // Beginners
        if (totalCompletions >= 1) unlock(user, "First Steps", "Completed your first habit!");
        if (totalHabits >= 3) unlock(user, "Early Bird", "Tracking 3 or more habits.");
        if (maxCurrentStreak >= 3) unlock(user, "On Fire", "Achieved a 3-day streak!");
        if (totalCompletions >= 10) unlock(user, "Habitual", "Completed 10 habits total!");
        
        // Consistency
        if (maxCurrentStreak >= 7) unlock(user, "Weekly Warrior", "Maintained a 7-day streak!");
        if (maxLongestStreak >= 30) unlock(user, "Monthly Master", "Achieved a 30-day streak!");
        if (maxLongestStreak >= 60) unlock(user, "Unstoppable", "Achieved a 60-day streak!");
        if (maxLongestStreak >= 100) unlock(user, "Consistency King", "Achieved a 100-day streak!");
        if (maxLongestStreak >= 180) unlock(user, "Life Changer", "Achieved a 180-day streak!");
        if (maxLongestStreak >= 365) unlock(user, "Legendary", "Achieved a 365-day streak!");

        // Productivity
        if (totalCompletions >= 100) unlock(user, "Dedicated", "Completed 100 habits total!");
        if (totalCompletions >= 250) unlock(user, "Goal Getter", "Completed 250 habits total!");
        if (totalCompletions >= 500) unlock(user, "Productivity Pro", "Completed 500 habits total!");
        if (totalCompletions >= 1000) unlock(user, "HabitLegend", "Completed 1000 habits total!");

        // Architect
        if (totalHabits >= 5) unlock(user, "Architect", "Tracking 5 or more habits.");
        if (totalHabits >= 10) unlock(user, "Master Architect", "Tracking 10 or more habits.");
        if (totalHabits >= 20) unlock(user, "Empire Builder", "Tracking 20 or more habits.");

        // Skill
        if (hasPerfectWeek(user)) unlock(user, "Perfect Week", "100% completion rate for 7 consecutive days!");
    }

    private boolean hasPerfectWeek(User user) {
        // A week is perfect if every day for the last 7 days had 100% completion rate
        // We can use analyticsService.getProgress to get daily rates
        var progress = analyticsService.getProgress(user.getUsername());
        if (progress == null || progress.getDailyCompletionRates() == null) return false;
        
        var rates = progress.getDailyCompletionRates();
        if (rates.size() < 7) return false;

        // Get the last 7 values
        List<Double> last7 = rates.values().stream()
                .skip(Math.max(0, rates.size() - 7))
                .collect(Collectors.toList());
        
        return last7.size() >= 7 && last7.stream().allMatch(rate -> rate >= 99.9);
    }

    private void unlock(User user, String title, String description) {
        if (!achievementRepository.existsByUserAndTitle(user, title)) {
            achievementRepository.save(Achievement.builder()
                    .user(user)
                    .title(title)
                    .description(description)
                    .earnedAt(LocalDateTime.now())
                    .build());
            
            notificationService.createNotification(user, "🎉 Achievement Unlocked: " + title + "! You're doing great!", NotificationType.ACHIEVEMENT);
            log.info("Unlocked achievement '{}' for user '{}'", title, user.getUsername());
        }
    }
}
