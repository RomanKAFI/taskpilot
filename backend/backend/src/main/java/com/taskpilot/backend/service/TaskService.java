package com.taskpilot.backend.service;

import com.taskpilot.backend.dto.CreateTaskRequest;
import com.taskpilot.backend.dto.TaskDto;
import com.taskpilot.backend.dto.UpdateTaskStatusRequest;
import com.taskpilot.backend.model.Task;
import com.taskpilot.backend.model.TaskPriority;
import com.taskpilot.backend.model.TaskStatus;
import com.taskpilot.backend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // ===== Методы, которые ждёт TaskController =====

    /**
     * GET /api/v1/tasks?projectId=...
     * В TaskController вызывается service.list(projectId, status)
     * Сейчас статус можно игнорировать и просто возвращать все задачи проекта.
     */
    public List<TaskDto> list(UUID projectId, TaskStatus status) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * POST /api/v1/tasks
     * В TaskController вызывается service.create(request).
     * Здесь собираем TaskDto из CreateTaskRequest и передаём в createTask(...).
     */
    public TaskDto create(CreateTaskRequest request) {
        TaskDto dto = new TaskDto();
        dto.setProjectId(request.getProjectId());
        dto.setTitle(request.getTitle());
        dto.setDescription(request.getDescription());
        dto.setAssigneeId(request.getAssigneeId());
        dto.setStatus(request.getStatus());      // может быть null — тогда ниже подставим TODO
        dto.setDueDate(request.getDueDate());    // может быть null
        dto.setPriority(request.getPriority());  // может быть null, подставим MEDIUM

        return createTask(dto);
    }

    /**
     * PATCH /api/v1/tasks/{id}/status
     * В TaskController вызывается service.updateStatus(id, request).
     * Просто достаём статус и переиспользуем метод ниже.
     */
    public void updateStatus(UUID taskId, UpdateTaskStatusRequest request) {
        updateStatus(taskId, request.getStatus());
    }

    // ===== Внутренние методы работы с сущностью Task =====

    public TaskDto createTask(TaskDto dto) {
        Task task = new Task();
        task.setId(UUID.randomUUID());
        task.setProjectId(dto.getProjectId());
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setAssigneeId(dto.getAssigneeId());

        // статус: если null — ставим TODO
        task.setStatus(dto.getStatus() != null ? dto.getStatus() : TaskStatus.TODO);

        // новые поля
        task.setDueDate(dto.getDueDate());
        task.setPriority(dto.getPriority() != null ? dto.getPriority() : TaskPriority.MEDIUM);

        task.setCreatedAt(Instant.now());

        Task saved = taskRepository.save(task);
        return toDto(saved);
    }

    public void updateStatus(UUID taskId, TaskStatus status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(status);
        taskRepository.save(task);
    }

    private TaskDto toDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setProjectId(task.getProjectId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setAssigneeId(task.getAssigneeId());
        dto.setStatus(task.getStatus());
        dto.setDueDate(task.getDueDate());       // дедлайн наружу
        dto.setPriority(task.getPriority());     // приоритет наружу
        dto.setCreatedAt(task.getCreatedAt());
        return dto;
    }
}
