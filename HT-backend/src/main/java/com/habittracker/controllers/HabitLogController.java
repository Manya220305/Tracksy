package com.habittracker.controllers;

import com.habittracker.dto.HabitLogDTO;
import com.habittracker.services.HabitLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/habit-logs")
@RequiredArgsConstructor
public class HabitLogController {

    private final HabitLogService habitLogService;

    @PostMapping
    public ResponseEntity<HabitLogDTO> logCompletion(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody HabitLogDTO dto) {
        HabitLogDTO saved = habitLogService.logHabit(userDetails.getUsername(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{habitId}")
    public ResponseEntity<List<HabitLogDTO>> getLogsForHabit(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long habitId,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(habitLogService.getLogsForHabit(userDetails.getUsername(), habitId, month, year));
    }
}
