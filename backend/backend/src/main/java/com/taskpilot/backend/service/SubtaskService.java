package com.taskpilot.backend.service;

import com.taskpilot.backend.dto.CreateSubtaskRequest;
import com.taskpilot.backend.dto.UpdateSubtaskStatusRequest;
import com.taskpilot.backend.model.Subtask;
import com.taskpilot.backend.model.TaskStatus;
import com.taskpilot.backend.repository.SubtaskRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class SubtaskService {
    private final SubtaskRepository repo;

    public SubtaskService(SubtaskRepository repo) { this.repo = repo; }

    public List<Subtask> list(UUID taskId, TaskStatus status) {
        if (status != null) return repo.findByTaskIdAndStatus(taskId, status);
        return repo.findByTaskId(taskId);
    }

    public Subtask create(CreateSubtaskRequest req) {
        Subtask s = new Subtask();
        s.setId(UUID.randomUUID());
        s.setTaskId(req.getTaskId());
        s.setTitle(req.getTitle());
        s.setStatus(req.getStatus() != null ? req.getStatus() : TaskStatus.TODO);
        s.setCreatedAt(Instant.now());
        return repo.save(s);
    }

    public Subtask updateStatus(UUID id, UpdateSubtaskStatusRequest req) {
        Subtask s = repo.findById(id).orElseThrow();
        s.setStatus(req.getStatus());
        return repo.save(s);
    }
}
