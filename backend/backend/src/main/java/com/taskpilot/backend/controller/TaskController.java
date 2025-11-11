package com.taskpilot.backend.controller;

import com.taskpilot.backend.dto.CreateTaskRequest;
import com.taskpilot.backend.dto.TaskDto;
import com.taskpilot.backend.dto.UpdateTaskRequest;
import com.taskpilot.backend.model.TaskStatus;
import com.taskpilot.backend.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    /**
     * Список задач по проекту
     * GET /api/v1/tasks?projectId=...
     */
    @GetMapping
    public List<TaskDto> getTasks(@RequestParam UUID projectId) {
        return taskService.getTasksByProjectId(projectId);
    }

    /**
     * Создать задачу
     * POST /api/v1/tasks
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskDto createTask(@Valid @RequestBody CreateTaskRequest request) {
        return taskService.createTask(request);
    }

    /**
     * Обновить только статус
     * PATCH /api/v1/tasks/{id}/status?status=IN_PROGRESS
     */
    @PatchMapping("/{taskId}/status")
    public TaskDto updateStatus(
            @PathVariable UUID taskId,
            @RequestParam TaskStatus status
    ) {
        return taskService.updateStatus(taskId, status);
    }

    /**
     * Полное обновление задачи (title / status / priority / dueDate)
     * PATCH /api/v1/tasks/{id}
     */
    @PatchMapping("/{taskId}")
    public TaskDto updateTask(
            @PathVariable UUID taskId,
            @Valid @RequestBody UpdateTaskRequest request
    ) {
        return taskService.updateTask(taskId, request);
    }

    /**
     * Удалить задачу
     * DELETE /api/v1/tasks/{id}
     */
    @DeleteMapping("/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable UUID taskId) {
        taskService.deleteTask(taskId);
    }
}
