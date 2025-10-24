package com.taskpilot.backend.dto;

import com.taskpilot.backend.model.TaskStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateTaskStatusRequest {
    @NotNull
    private TaskStatus status;

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
}
