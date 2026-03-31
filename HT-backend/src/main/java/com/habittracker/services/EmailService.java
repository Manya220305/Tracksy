package com.habittracker.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendReminderEmail(String toEmail, String username) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("⚠️ Habit Tracker Reminder");
            message.setText("Hi " + username + ",\n\n" +
                    "This is a friendly reminder that you haven't completed any of your habits today!\n" +
                    "There's still time before midnight to log your progress and keep your streaks alive.\n\n" +
                    "Keep up the great work,\n" +
                    "The Habit Tracker Team");
            mailSender.send(message);
            log.info("Reminder email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send reminder email to: {}", toEmail, e);
        }
    }
}
