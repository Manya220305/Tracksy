package com.habittracker.services;

import com.habittracker.dto.NotificationDTO;
import com.habittracker.models.Notification;
import com.habittracker.models.NotificationType;
import com.habittracker.models.User;
import com.habittracker.repositories.NotificationRepository;
import com.habittracker.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    public List<NotificationDTO> getRecentNotifications(String username) {
        User user = getUser(username);
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, PageRequest.of(0, 7))
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAllAsRead(String username) {
        User user = getUser(username);
        notificationRepository.markAllAsReadByUser(user);
    }

    @Transactional
    public void createNotification(User user, String message, NotificationType type) {
        try {
            Notification notification = Notification.builder()
                    .user(user)
                    .message(message)
                    .type(type)
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);
            log.info("Created {} notification for user {}: {}", type, user.getUsername(), message);
        } catch (Exception e) {
            log.error("Failed to create notification for user {}", user.getUsername(), e);
        }
    }

    private NotificationDTO toDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
