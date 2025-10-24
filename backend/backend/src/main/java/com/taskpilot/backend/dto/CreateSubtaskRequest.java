package com.taskpilot.backend.dto;

import com.taskpilot.backend.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class CreateSubtaskRequest {
    @NotNull
    private UUID taskId;
    @NotBlank
    private String title;
    private TaskStatus status;

    public UUID getTaskId() { return taskId; }
    public void setTaskId(UUID taskId) { this.taskId = taskId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
}
