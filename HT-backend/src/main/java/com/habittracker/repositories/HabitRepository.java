package com.habittracker.repositories;

import com.habittracker.models.Habit;
import com.habittracker.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findAllByUser(User user);
    Optional<Habit> findByIdAndUser(Long id, User user);
    long countByUser(User user);
}
