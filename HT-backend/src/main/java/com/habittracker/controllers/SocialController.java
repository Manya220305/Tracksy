package com.habittracker.controllers;

import com.habittracker.models.PartnershipRequest;
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
    public ResponseEntity<List<PartnershipRequest>> getRequests(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserEntityByUsername(userDetails.getUsername());
        return ResponseEntity.ok(partnershipService.getPendingRequests(user));
    }

    @PostMapping("/accept/{requestId}")
    public ResponseEntity<?> acceptRequest(@AuthenticationPrincipal UserDetails userDetails, @PathVariable Long requestId) {
        User user = userService.getUserEntityByUsername(userDetails.getUsername());
        partnershipService.acceptRequest(requestId, user);
        return ResponseEntity.ok(Map.of("message", "Request accepted"));
    }

    @GetMapping("/partners")
    public ResponseEntity<List<User>> getPartners(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.getUserEntityByUsername(userDetails.getUsername());
        return ResponseEntity.ok(partnershipService.getPartners(user));
    }
}
