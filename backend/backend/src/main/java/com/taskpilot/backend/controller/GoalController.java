package com.taskpilot.backend.controller;

import com.taskpilot.backend.dto.CreateGoalRequest;
import com.taskpilot.backend.model.Goal;
import com.taskpilot.backend.service.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/goals")
public class GoalController {
    private final GoalService service;

    public GoalController(GoalService service) { this.service = service; }

    @GetMapping
    public List<Goal> list() {
        return service.list();
    }

    @PostMapping
    public ResponseEntity<Goal> create(@Valid @RequestBody CreateGoalRequest req) {
        return ResponseEntity.ok(service.create(req));
    }
}
