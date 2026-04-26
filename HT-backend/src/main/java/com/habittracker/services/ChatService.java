package com.habittracker.services;

import com.habittracker.models.ChatMessage;
import com.habittracker.models.User;
import com.habittracker.repositories.ChatMessageRepository;
import com.habittracker.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    public void sendMessage(User sender, Long receiverId, String content) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        ChatMessage message = ChatMessage.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .build();

        chatMessageRepository.save(message);
    }

    public List<ChatMessage> getChatHistory(User user1, Long user2Id) {
        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new RuntimeException("Partner not found"));

        return chatMessageRepository.findChatHistory(user1, user2);
    }
}
