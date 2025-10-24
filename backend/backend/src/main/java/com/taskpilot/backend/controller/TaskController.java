package com.taskpilot.backend.controller;

import com.taskpilot.backend.dto.CreateTaskRequest;
import com.taskpilot.backend.dto.UpdateTaskStatusRequest;
import com.taskpilot.backend.model.Task;
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

    public TaskController(TaskService service) { this.service = service; }

    @GetMapping
    public List<Task> list(@RequestParam UUID projectId,
                           @RequestParam(required = false) TaskStatus status) {
        return service.list(projectId, status);
    }

    @PostMapping
    public ResponseEntity<Task> create(@Valid @RequestBody CreateTaskRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Task> updateStatus(@PathVariable UUID id,
                                             @Valid @RequestBody UpdateTaskStatusRequest req) {
        return ResponseEntity.ok(service.updateStatus(id, req));
    }
}
