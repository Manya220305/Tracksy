package com.habittracker.controllers;

import com.habittracker.dto.PartnerDTO;
import com.habittracker.dto.PartnershipRequestDTO;
import com.habittracker.models.User;
import com.habittracker.services.PartnershipService;
import com.habittracker.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/social")
@RequiredArgsConstructor
public class SocialController {

    private final PartnershipService partnershipService;
    private final UserService userService;

    @PostMapping("/request/{username}")
    public ResponseEntity<?> sendRequest(@AuthenticationPrincipal UserDetails userDetails, @PathVariable String username) {
        User sender = userService.getUserEntityByUsername(userDetails.getUsername());
        partnershipService.sendRequest(sender, username);
        return ResponseEntity.ok(Map.of("message", "Request sent successfully"));
    }

    @GetMapping("/requests")
    public ResponseEntity<List<PartnershipRequestDTO>> getRequests(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserEntityByUsername(userDetails.getUsername());
        List<PartnershipRequestDTO> dtos = partnershipService.getPendingRequests(user).stream()
                .map(req -> PartnershipRequestDTO.builder()
                        .id(req.getId())
                        .sender(convertToPartnerDTO(req.getSender()))
                        .status(req.getStatus())
                        .createdAt(req.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/accept/{requestId}")
    public ResponseEntity<?> acceptRequest(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long requestId) {
        User user = userService.getUserEntityByUsername(userDetails.getUsername());
        partnershipService.acceptRequest(requestId, user);
        return ResponseEntity.ok(Map.of("message", "Request accepted"));
    }

    @GetMapping("/partners")
    public ResponseEntity<List<PartnerDTO>> getPartners(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserEntityByUsername(userDetails.getUsername());
        List<PartnerDTO> dtos = partnershipService.getPartners(user).stream()
                .map(this::convertToPartnerDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private PartnerDTO convertToPartnerDTO(User user) {
        return PartnerDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .profileImageUrl(user.getProfileImageUrl())
                .currentStreak(0) // Logic for streak calculation can be added here
                .build();
    }
}
