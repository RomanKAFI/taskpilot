package com.taskpilot.backend.service;

import com.taskpilot.backend.dto.CreateGoalRequest;
import com.taskpilot.backend.model.Goal;
import com.taskpilot.backend.repository.GoalRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class GoalService {
    private final GoalRepository repo;

    public GoalService(GoalRepository repo) { this.repo = repo; }

    public List<Goal> list() {
        return repo.findAll();
    }

    public Goal create(CreateGoalRequest req) {
        Goal g = new Goal();
        g.setId(UUID.randomUUID());
        g.setTitle(req.getTitle());
        g.setDescription(req.getDescription());
        g.setOwnerId(req.getOwnerId());
        g.setCreatedAt(Instant.now());
        return repo.save(g);
    }
}
