package com.habittracker.repositories;

import com.habittracker.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameOrEmail(String username, String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    @Query("SELECT DISTINCT u FROM User u JOIN u.habits h " +
           "WHERE u.reminderEnabled = true AND NOT EXISTS " +
           "(SELECT hl FROM HabitLog hl WHERE hl.habit.user = u AND hl.date = CURRENT_DATE AND hl.completed = true)")
    List<User> findUsersNeedingReminders();
}
