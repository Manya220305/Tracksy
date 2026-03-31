package com.habittracker.controllers;

import com.habittracker.dto.UserSettingsDTO;
import com.habittracker.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/settings")
    public ResponseEntity<UserSettingsDTO> getSettings(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserSettings(userDetails.getUsername()));
    }

    @PutMapping("/settings")
    public ResponseEntity<?> updateSettings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserSettingsDTO settingsDTO) {
        try {
            UserSettingsDTO updated = userService.updateUserSettings(userDetails.getUsername(), settingsDTO);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
        }
    }
}
