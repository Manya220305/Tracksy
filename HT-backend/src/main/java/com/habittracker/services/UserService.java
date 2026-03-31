package com.habittracker.services;

import com.habittracker.dto.UserSettingsDTO;
import com.habittracker.models.User;
import com.habittracker.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserSettingsDTO getUserSettings(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return UserSettingsDTO.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .reminderEnabled(user.isReminderEnabled())
                .reminderTime(user.getReminderTime())
                .build();
    }

    @Transactional
    public UserSettingsDTO updateUserSettings(String currentUsername, UserSettingsDTO updatedSettings) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if username is being updated and if it's already taken
        if (updatedSettings.getUsername() != null && !updatedSettings.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(updatedSettings.getUsername())) {
                throw new IllegalArgumentException("Username is already taken");
            }
            user.setUsername(updatedSettings.getUsername());
        }

        // Check if email is being updated and if it's already taken
        if (updatedSettings.getEmail() != null && !updatedSettings.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(updatedSettings.getEmail())) {
                throw new IllegalArgumentException("Email is already in use");
            }
            user.setEmail(updatedSettings.getEmail());
        }

        user.setReminderEnabled(updatedSettings.isReminderEnabled());
        user.setReminderTime(updatedSettings.getReminderTime());

        userRepository.save(user);

        return UserSettingsDTO.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .reminderEnabled(user.isReminderEnabled())
                .reminderTime(user.getReminderTime())
                .build();
    }
}
