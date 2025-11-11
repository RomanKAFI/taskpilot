// src/main/java/com/taskpilot/backend/dto/UpdateTaskRequest.java
package com.taskpilot.backend.dto;

import java.time.LocalDate;

public record UpdateTaskRequest(
        String title,
        String priority,
        String status,
        LocalDate dueDate
) {}
