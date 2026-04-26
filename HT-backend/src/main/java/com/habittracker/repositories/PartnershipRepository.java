package com.habittracker.repositories;

import com.habittracker.models.Partnership;
import com.habittracker.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PartnershipRepository extends JpaRepository<Partnership, Long> {
    
    @Query("SELECT p FROM Partnership p WHERE p.user1 = :user OR p.user2 = :user")
    List<Partnership> findAllByUser(@Param("user") User user);

    @Query("SELECT p FROM Partnership p WHERE (p.user1 = :u1 AND p.user2 = :u2) OR (p.user1 = :u2 AND p.user2 = :u1)")
    Optional<Partnership> findByUsers(@Param("u1") User u1, @Param("u2") User u2);
}
