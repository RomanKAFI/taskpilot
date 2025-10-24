package com.taskpilot.backend.controller;

import com.taskpilot.backend.dto.CreateProjectRequest;
import com.taskpilot.backend.model.Project;
import com.taskpilot.backend.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) { this.service = service; }

    @GetMapping
    public List<Project> listByGoal(@RequestParam UUID goalId) {
        return service.listByGoal(goalId);
    }

    @PostMapping
    public ResponseEntity<Project> create(@Valid @RequestBody CreateProjectRequest req) {
        return ResponseEntity.ok(service.create(req));
    }
}
