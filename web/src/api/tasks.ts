// web/src/api/tasks.ts
import client from "./client";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

export type Task = {
    id: string;
    projectId: string;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;   // <= ВАЖНО: string | null
    createdAt: string;
};

export type CreateTaskPayload = {
    projectId: string;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
};

// получить задачи проекта
export async function fetchTasks(projectId: string): Promise<Task[]> {
    const res = await client.get("/tasks", {
        params: { projectId },
    });
    return res.data;
}

// создать задачу
export async function createTask(payload: CreateTaskPayload): Promise<Task> {
    const res = await client.post("/tasks", payload);
    return res.data;
}

// обновить статус задачи
export async function patchTaskStatus(
    taskId: string,
    newStatus: TaskStatus,
): Promise<Task> {
    const res = await client.patch(`/tasks/${taskId}/status`, null, {
        params: { status: newStatus },
    });
    return res.data;
}

// удалить задачу
export async function deleteTask(taskId: string): Promise<void> {
    await client.delete(`/tasks/${taskId}`);
}
