package com.habittracker.scheduler;

import com.habittracker.models.Habit;
import com.habittracker.models.NotificationType;
import com.habittracker.models.User;
import com.habittracker.repositories.UserRepository;
import com.habittracker.services.EmailService;
import com.habittracker.services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReminderScheduler {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;

    // Runs every day at 11:30 PM (23:30) server local time
    @Scheduled(cron = "0 30 23 * * ?")
    public void sendDailyReminders() {
        log.info("Starting daily habit reminder job...");
        List<User> usersNeedingReminders = userRepository.findUsersNeedingReminders();
        
        log.info("Found {} users who need reminders today.", usersNeedingReminders.size());
        
        for (User user : usersNeedingReminders) {
            emailService.sendReminderEmail(user.getEmail(), user.getUsername());
            notificationService.createNotification(user, "⚠️ You are about to miss today's habits! Complete them before midnight to keep your streaks alive.", NotificationType.ALERT);
        }
        
        log.info("Finished daily habit reminder job.");
    }

    // Runs every 5 minutes to check for missed habits based on scheduledTime
    @Scheduled(fixedRate = 300000)
    public void checkMissedHabits() {
        log.info("Starting missed habit check job...");
        List<User> users = userRepository.findAll();
        LocalTime now = LocalTime.now();
        LocalDate today = LocalDate.now();

        for (User user : users) {
            List<Habit> habits = user.getHabits();
            if (habits == null) continue;

            for (Habit habit : habits) {
                // If habit has a scheduled time and that time has passed
                if (habit.getScheduledTime() != null && now.isAfter(habit.getScheduledTime())) {
                    
                    // Check if habit is NOT completed today
                    boolean completedToday = habit.getLogs() != null && habit.getLogs().stream()
                            .anyMatch(log -> log.getDate().equals(today) && log.getCompleted());

                    if (!completedToday) {
                        // Check if we already notified for this habit today
                        if (!notificationService.isAlreadyNotifiedToday(user, habit.getId(), NotificationType.MISSED_HABIT)) {
                            String formattedTime = habit.getScheduledTime().format(DateTimeFormatter.ofPattern("hh:mm a"));
                            String message = String.format("You missed your %s habit: %s", formattedTime, habit.getName());
                            
                            notificationService.createNotification(user, message, NotificationType.MISSED_HABIT, habit.getId());
                            log.info("Sent missed habit notification to user {} for habit {}", user.getUsername(), habit.getName());
                        }
                    }
                }
            }
        }
        log.info("Finished missed habit check job.");
    }
}
