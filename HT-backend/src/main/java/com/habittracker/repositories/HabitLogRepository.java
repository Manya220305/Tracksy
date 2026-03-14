package com.habittracker.repositories;

import com.habittracker.models.Habit;
import com.habittracker.models.HabitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HabitLogRepository extends JpaRepository<HabitLog, Long> {
    List<HabitLog> findByHabitOrderByDateDesc(Habit habit);
    List<HabitLog> findByHabitAndDateBetweenOrderByDateAsc(Habit habit, LocalDate start, LocalDate end);
    Optional<HabitLog> findByHabitAndDate(Habit habit, LocalDate date);

    @Query("SELECT hl FROM HabitLog hl WHERE hl.habit.user.id = :userId AND hl.date = :date")
    List<HabitLog> findByUserIdAndDate(@Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("SELECT hl FROM HabitLog hl WHERE hl.habit.user.id = :userId AND hl.date BETWEEN :start AND :end")
    List<HabitLog> findByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end);

    @Query("SELECT COUNT(hl) FROM HabitLog hl WHERE hl.habit.user.id = :userId AND hl.completed = true")
    long countCompletedByUserId(@Param("userId") Long userId);
}
