package com.habittracker.dto;

import com.habittracker.models.PartnershipRequest;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class PartnershipRequestDTO {
    private Long id;
    private PartnerDTO sender;
    private PartnershipRequest.RequestStatus status;
    private LocalDateTime createdAt;
}
