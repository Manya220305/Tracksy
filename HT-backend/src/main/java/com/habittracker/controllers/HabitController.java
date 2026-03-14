package com.habittracker.controllers;

import com.habittracker.dto.HabitDTO;
import com.habittracker.services.HabitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/habits")
@RequiredArgsConstructor
public class HabitController {

    private final HabitService habitService;

    @GetMapping
    public ResponseEntity<List<HabitDTO>> getAllHabits(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(habitService.getAllHabits(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<HabitDTO> createHabit(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody HabitDTO habitDTO) {
        HabitDTO created = habitService.createHabit(userDetails.getUsername(), habitDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HabitDTO> updateHabit(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody HabitDTO habitDTO) {
        return ResponseEntity.ok(habitService.updateHabit(userDetails.getUsername(), id, habitDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        habitService.deleteHabit(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleHabitToday(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        habitService.toggleHabitToday(userDetails.getUsername(), id);
        return ResponseEntity.ok().build();
    }
}
