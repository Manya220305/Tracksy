package com.habittracker.repositories;

import com.habittracker.models.ChatMessage;
import com.habittracker.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    @Query("SELECT m FROM ChatMessage m WHERE (m.sender = :u1 AND m.receiver = :u2) OR (m.sender = :u2 AND m.receiver = :u1) ORDER BY m.timestamp ASC")
    List<ChatMessage> findChatHistory(@Param("u1") User u1, @Param("u2") User u2);
}
