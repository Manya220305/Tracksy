package com.habittracker.scheduler;

import com.habittracker.models.NotificationType;
import com.habittracker.models.User;
import com.habittracker.repositories.UserRepository;
import com.habittracker.services.EmailService;
import com.habittracker.services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

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
}
