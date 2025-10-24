package com.taskpilot.backend.repository;

import com.taskpilot.backend.model.Subtask;
import com.taskpilot.backend.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SubtaskRepository extends JpaRepository<Subtask, UUID> {
    List<Subtask> findByTaskId(UUID taskId);
    List<Subtask> findByTaskIdAndStatus(UUID taskId, TaskStatus status);
}
