package com.habittracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import org.springframework.cache.annotation.EnableCaching;

/**
 * Main application class for the Tracksy Backend.
 * 
 * SYSTEM DESIGN NOTE:
 * - @EnableCaching: Introduces a lightweight in-memory caching layer to reduce DB load
 *   for frequently accessed, non-volatile data like analytics and dashboard stats.
 * - @EnableScheduling: Handles background async tasks (e.g., cron jobs for daily resets).
 */
@SpringBootApplication
@EnableScheduling
@EnableCaching
public class HabitTrackerApplication {
    public static void main(String[] args) {
        SpringApplication.run(HabitTrackerApplication.class, args);
    }
}
