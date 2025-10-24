package com.taskpilot.backend.repository;

import com.taskpilot.backend.model.Task;
import com.taskpilot.backend.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByProjectId(UUID projectId);
    List<Task> findByProjectIdAndStatus(UUID projectId, TaskStatus status);
}
