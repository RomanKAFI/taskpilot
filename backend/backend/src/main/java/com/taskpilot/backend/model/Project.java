package com.taskpilot.backend.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "project")
public class Project {

    @Id
    private UUID id;

    @Column(name = "goal_id", nullable = false)
    private UUID goalId;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    // getters/setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getGoalId() { return goalId; }
    public void setGoalId(UUID goalId) { this.goalId = goalId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
