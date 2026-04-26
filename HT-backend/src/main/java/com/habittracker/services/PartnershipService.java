package com.habittracker.services;

import com.habittracker.models.Partnership;
import com.habittracker.models.PartnershipRequest;
import com.habittracker.models.User;
import com.habittracker.repositories.PartnershipRepository;
import com.habittracker.repositories.PartnershipRequestRepository;
import com.habittracker.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PartnershipService {

    private final PartnershipRepository partnershipRepository;
    private final PartnershipRequestRepository requestRepository;
    private final UserRepository userRepository;

    @Transactional
    public void sendRequest(User sender, String receiverUsername) {
        User receiver = userRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException("You cannot partner with yourself");
        }

        if (partnershipRepository.findByUsers(sender, receiver).isPresent()) {
            throw new RuntimeException("Already partners");
        }

        if (requestRepository.findBySenderAndReceiverAndStatus(sender, receiver, PartnershipRequest.RequestStatus.PENDING).isPresent()) {
            throw new RuntimeException("Request already sent");
        }

        PartnershipRequest request = PartnershipRequest.builder()
                .sender(sender)
                .receiver(receiver)
                .status(PartnershipRequest.RequestStatus.PENDING)
                .build();

        requestRepository.save(request);
    }

    public List<PartnershipRequest> getPendingRequests(User receiver) {
        return requestRepository.findByReceiverAndStatus(receiver, PartnershipRequest.RequestStatus.PENDING);
    }

    @Transactional
    public void acceptRequest(Long requestId, User receiver) {
        PartnershipRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getReceiver().getId().equals(receiver.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        request.setStatus(PartnershipRequest.RequestStatus.ACCEPTED);
        requestRepository.save(request);

        Partnership partnership = Partnership.builder()
                .user1(request.getSender())
                .user2(request.getReceiver())
                .build();

        partnershipRepository.save(partnership);
    }

    public List<User> getPartners(User user) {
        return partnershipRepository.findAllByUser(user).stream()
                .map(p -> p.getUser1().getId().equals(user.getId()) ? p.getUser2() : p.getUser1())
                .collect(Collectors.toList());
    }
}
