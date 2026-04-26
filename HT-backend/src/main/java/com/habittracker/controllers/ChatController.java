package com.habittracker.controllers;

import com.habittracker.models.ChatMessage;
import com.habittracker.models.User;
import com.habittracker.services.ChatService;
import com.habittracker.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> payload) {
        
        User sender = userService.getUserEntityByUsername(userDetails.getUsername());
        Long receiverId = Long.valueOf(payload.get("receiverId").toString());
        String content = payload.get("content").toString();

        chatService.sendMessage(sender, receiverId, content);
        return ResponseEntity.ok(Map.of("message", "Message sent"));
    }

    @GetMapping("/history/{partnerId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long partnerId) {
        
        User user = userService.getUserEntityByUsername(userDetails.getUsername());
        return ResponseEntity.ok(chatService.getChatHistory(user, partnerId));
    }
}
