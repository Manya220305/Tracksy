package com.habittracker.controllers;

import com.habittracker.dto.PartnerDTO;
import com.habittracker.models.ChatMessage;
import com.habittracker.models.User;
import com.habittracker.services.ChatService;
import com.habittracker.services.UserService;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    public ResponseEntity<List<ChatMessageDTO>> getChatHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long partnerId) {
        
        User user = userService.getUserEntityByUsername(userDetails.getUsername());
        List<ChatMessageDTO> dtos = chatService.getChatHistory(user, partnerId).stream()
                .map(msg -> ChatMessageDTO.builder()
                        .id(msg.getId())
                        .sender(convertToPartnerDTO(msg.getSender()))
                        .content(msg.getContent())
                        .timestamp(msg.getTimestamp())
                        .read(msg.isRead())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private PartnerDTO convertToPartnerDTO(User user) {
        return PartnerDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }

    @Data
    @Builder
    public static class ChatMessageDTO {
        private Long id;
        private PartnerDTO sender;
        private String content;
        private LocalDateTime timestamp;
        private boolean read;
    }
}
