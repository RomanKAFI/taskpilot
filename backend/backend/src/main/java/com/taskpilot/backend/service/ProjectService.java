package com.taskpilot.backend.service;

import com.taskpilot.backend.dto.CreateProjectRequest;
import com.taskpilot.backend.model.Project;
import com.taskpilot.backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {
    private final ProjectRepository repo;

    public ProjectService(ProjectRepository repo) { this.repo = repo; }

    public List<Project> listByGoal(UUID goalId) {
        return repo.findByGoalId(goalId);
    }

    public Project create(CreateProjectRequest req) {
        Project p = new Project();
        p.setId(UUID.randomUUID());
        p.setGoalId(req.getGoalId());
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setCreatedAt(Instant.now());
        return repo.save(p);
    }
}
