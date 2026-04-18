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

        // 1. First Steps
        allBadges.add(createDTO("First Steps", "Completed your first habit!", 1, totalCompletions, "TROPHY", "blue", earnedMap));
        
        // 2. Habitual
        allBadges.add(createDTO("Habitual", "Completed 10 habits total!", 10, totalCompletions, "STAR", "green", earnedMap));

        // 3. Dedicated
        allBadges.add(createDTO("Dedicated", "Completed 100 habits total!", 100, totalCompletions, "AWARD", "purple", earnedMap));

        // 4. Architect
        allBadges.add(createDTO("Architect", "Tracking 5 or more habits.", 5, totalHabits, "TARGET", "orange", earnedMap));

        // 5. Weekly Warrior
        allBadges.add(createDTO("Weekly Warrior", "Maintain a 7-day streak.", 7, maxCurrentStreak, "FLAME", "pink", earnedMap));

        // 6. Monthly Master
        allBadges.add(createDTO("Monthly Master", "Achieve a 30-day streak.", 30, maxLongestStreak, "CALENDAR", "indigo", earnedMap));

        // 7. Consistency King
        allBadges.add(createDTO("Consistency King", "Achieve a 100-day streak.", 100, maxLongestStreak, "TROPHY", "yellow", earnedMap));

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
    protected void checkAndUnlock(User user) {
        long totalCompletions = habitLogRepository.countCompletedByUserId(user.getId());
        long totalHabits = habitRepository.countByUser(user);
        List<StreakResponse> streaks = analyticsService.getStreaks(user.getUsername());
        int maxCurrentStreak = streaks.stream().mapToInt(StreakResponse::getCurrentStreak).max().orElse(0);
        int maxLongestStreak = streaks.stream().mapToInt(StreakResponse::getLongestStreak).max().orElse(0);

        if (totalCompletions >= 1) unlock(user, "First Steps", "Completed your first habit!");
        if (totalCompletions >= 100) unlock(user, "Dedicated", "Completed 100 habits total!");
        if (totalHabits >= 5) unlock(user, "Architect", "Tracking 5 or more habits.");
        
        if (maxCurrentStreak >= 7) unlock(user, "Weekly Warrior", "Maintained a 7-day streak!");
        if (maxLongestStreak >= 30) unlock(user, "Monthly Master", "Achieved a 30-day streak!");
        if (maxLongestStreak >= 100) unlock(user, "Consistency King", "Achieved a 100-day streak!");
        
        // Bonus: 10 completions
        if (totalCompletions >= 10) unlock(user, "Habitual", "Completed 10 habits total!");
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
