package com.taskpilot.backend.controller;

import com.taskpilot.backend.dto.CreateSubtaskRequest;
import com.taskpilot.backend.dto.UpdateSubtaskStatusRequest;
import com.taskpilot.backend.model.Subtask;
import com.taskpilot.backend.model.TaskStatus;
import com.taskpilot.backend.service.SubtaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/subtasks")
public class SubtaskController {

    private final SubtaskService service;

    public SubtaskController(SubtaskService service) { this.service = service; }

    @GetMapping
    public List<Subtask> list(@RequestParam UUID taskId,
                              @RequestParam(required = false) TaskStatus status) {
        return service.list(taskId, status);
    }

    @PostMapping
    public ResponseEntity<Subtask> create(@Valid @RequestBody CreateSubtaskRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Subtask> updateStatus(@PathVariable UUID id,
                                                @Valid @RequestBody UpdateSubtaskStatusRequest req) {
        return ResponseEntity.ok(service.updateStatus(id, req));
    }
}
