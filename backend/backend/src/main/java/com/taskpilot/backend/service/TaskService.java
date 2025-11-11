package com.taskpilot.backend.service;

import com.taskpilot.backend.dto.CreateTaskRequest;
import com.taskpilot.backend.dto.TaskDto;
import com.taskpilot.backend.dto.UpdateTaskRequest;
import com.taskpilot.backend.model.Task;
import com.taskpilot.backend.model.TaskStatus;
import com.taskpilot.backend.repository.TaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;

    /**
     * Получить задачи по projectId.
     */
    public List<TaskDto> getTasksByProjectId(UUID projectId) {
        List<Task> tasks = taskRepository.findByProjectId(projectId);
        return tasks.stream()
                .map(this::toDto)
                .toList();
    }

    /**
     * Создать задачу.
     */
    public TaskDto createTask(CreateTaskRequest request) {
        Task task = new Task();

        // Генерируем ID вручную, чтобы Hibernate был доволен
        task.setId(UUID.randomUUID());

        task.setProjectId(request.getProjectId());
        task.setTitle(request.getTitle());
        task.setStatus(request.getStatus());      // TODO / IN_PROGRESS / BLOCKED / DONE
        task.setPriority(request.getPriority());  // HIGH / MEDIUM / LOW

        // 👉 dueDate уже LocalDate в DTO, просто копируем (может быть null — это ок)
        LocalDate dueDate = request.getDueDate();
        task.setDueDate(dueDate);

        // created_at — ставим сейчас, если вдруг null
        if (task.getCreatedAt() == null) {
            task.setCreatedAt(Instant.now());
        }

        task = taskRepository.save(task);
        return toDto(task);
    }

    /**
     * Обновить только статус задачи.
     */
    public TaskDto updateStatus(UUID taskId, TaskStatus newStatus) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));

        task.setStatus(newStatus);
        Task saved = taskRepository.save(task);

        return toDto(saved);
    }

    /**
     * Полное обновление задачи (Edit).
     * Пока фронт не шлёт все поля — оставляем заглушку.
     */
    public TaskDto updateTask(UUID taskId, UpdateTaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + taskId));

        // TODO: позже проставить в task поля из request (title, status, priority, dueDate и т.д.)

        Task saved = taskRepository.save(task);
        return toDto(saved);
    }

    /**
     * Удалить задачу.
     */
    public void deleteTask(UUID taskId) {
        if (!taskRepository.existsById(taskId)) {
            return;
        }
        taskRepository.deleteById(taskId);
    }

    /**
     * Маппинг Task -> TaskDto.
     */
    private TaskDto toDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setProjectId(task.getProjectId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setAssigneeId(task.getAssigneeId());
        dto.setStatus(task.getStatus());
        dto.setDueDate(task.getDueDate());
        dto.setPriority(task.getPriority());
        dto.setCreatedAt(task.getCreatedAt());
        return dto;
    }
}
