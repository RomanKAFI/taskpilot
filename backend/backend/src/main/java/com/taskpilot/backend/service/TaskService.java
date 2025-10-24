package com.taskpilot.backend.service;

import com.taskpilot.backend.dto.CreateTaskRequest;
import com.taskpilot.backend.dto.UpdateTaskStatusRequest;
import com.taskpilot.backend.model.Task;
import com.taskpilot.backend.model.TaskStatus;
import com.taskpilot.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class TaskService {
    private final TaskRepository repo;

    public TaskService(TaskRepository repo) { this.repo = repo; }

    public List<Task> list(UUID projectId, TaskStatus status) {
        if (status != null) return repo.findByProjectIdAndStatus(projectId, status);
        return repo.findByProjectId(projectId);
    }

    public Task create(CreateTaskRequest req) {
        Task t = new Task();
        t.setId(UUID.randomUUID());
        t.setProjectId(req.getProjectId());
        t.setTitle(req.getTitle());
        t.setDescription(req.getDescription());
        t.setAssigneeId(req.getAssigneeId());
        t.setStatus(req.getStatus() != null ? req.getStatus() : TaskStatus.TODO);
        t.setDueDate(req.getDueDate());
        t.setCreatedAt(Instant.now());
        return repo.save(t);
    }

    public Task updateStatus(UUID id, UpdateTaskStatusRequest req) {
        Task t = repo.findById(id).orElseThrow();
        t.setStatus(req.getStatus());
        return repo.save(t);
    }
}
