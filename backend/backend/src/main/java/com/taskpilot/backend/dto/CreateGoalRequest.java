package com.taskpilot.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public class CreateGoalRequest {
    @NotBlank
    private String title;
    private String description;
    private UUID ownerId;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public UUID getOwnerId() { return ownerId; }
    public void setOwnerId(UUID ownerId) { this.ownerId = ownerId; }
}
