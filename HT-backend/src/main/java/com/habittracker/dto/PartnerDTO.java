package com.habittracker.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PartnerDTO {
    private Long id;
    private String username;
    private String profileImageUrl;
    private int currentStreak;
}
