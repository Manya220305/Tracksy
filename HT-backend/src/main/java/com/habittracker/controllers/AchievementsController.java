package com.habittracker.controllers;

import com.habittracker.models.Achievement;
import com.habittracker.services.AchievementsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/achievements")
@RequiredArgsConstructor
public class AchievementsController {

    private final AchievementsService achievementsService;

    @GetMapping
    public ResponseEntity<List<Achievement>> getAchievements(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<Achievement> achievements = achievementsService
                .getAndCheckAchievements(userDetails.getUsername());
        return ResponseEntity.ok(achievements);
    }
}
