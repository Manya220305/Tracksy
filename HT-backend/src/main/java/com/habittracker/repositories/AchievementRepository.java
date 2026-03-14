package com.habittracker.repositories;

import com.habittracker.models.Achievement;
import com.habittracker.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findAllByUser(User user);
    boolean existsByUserAndTitle(User user, String title);
}
