package com.taskpilot.backend.controller;

import com.taskpilot.backend.dto.CreateTaskRequest;
import com.taskpilot.backend.dto.TaskDto;
import com.taskpilot.backend.dto.UpdateTaskStatusRequest;
import com.taskpilot.backend.model.TaskStatus;
import com.taskpilot.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    /**
     * GET /api/v1/tasks?projectId=...&status=...
     */
    @GetMapping
    public List<TaskDto> list(
            @RequestParam UUID projectId,
            @RequestParam(required = false) TaskStatus status
    ) {
        return service.list(projectId, status);
    }

    /**
     * POST /api/v1/tasks
     */
    @PostMapping
    public ResponseEntity<TaskDto> create(@Valid @RequestBody CreateTaskRequest request) {
        TaskDto created = service.create(request);
        return ResponseEntity.ok(created);
    }

    /**
     * PATCH /api/v1/tasks/{id}/status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateTaskStatusRequest request
    ) {
        service.updateStatus(id, request);
        return ResponseEntity.noContent().build();
    }
}
