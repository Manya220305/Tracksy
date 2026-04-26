package com.habittracker.repositories;

import com.habittracker.models.PartnershipRequest;
import com.habittracker.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PartnershipRequestRepository extends JpaRepository<PartnershipRequest, Long> {
    
    List<PartnershipRequest> findByReceiverAndStatus(User receiver, PartnershipRequest.RequestStatus status);
    
    Optional<PartnershipRequest> findBySenderAndReceiverAndStatus(User sender, User receiver, PartnershipRequest.RequestStatus status);
}
