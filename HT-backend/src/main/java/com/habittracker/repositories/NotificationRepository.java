package com.habittracker.repositories;

import com.habittracker.models.Notification;
import com.habittracker.models.NotificationType;
import com.habittracker.models.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    List<Notification> findByUserAndIsReadFalseAndCreatedAtAfterOrderByCreatedAtDesc(User user, LocalDateTime cutoff, Pageable pageable);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user = :user AND n.isRead = false")
    void markAllAsReadByUser(@Param("user") User user);

    boolean existsByUserAndHabitIdAndTypeAndCreatedAtAfter(User user, Long habitId, NotificationType type, LocalDateTime startOfDay);
}
