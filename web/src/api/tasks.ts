import api from "./client";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type Task = {
    id: string;
    projectId: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    assigneeId?: string | null;
    dueDate?: string | null;    // 'YYYY-MM-DD'
    priority: TaskPriority;     // новое поле
    createdAt: string;
};

// грузим задачи по projectId
export async function fetchTasks(projectId: string): Promise<Task[]> {
    const res = await api.get("/v1/tasks", { params: { projectId } });
    return res.data;
}

// меняем статус
export async function patchTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const res = await api.patch(`/v1/tasks/${id}/status`, { status });
    return res.data;
}

// удаление (если понадобится)
export async function deleteTask(id: string): Promise<void> {
    await api.delete(`/v1/tasks/${id}`);
}

// создание задачи
export async function createTask(
    projectId: string,
    title: string,
    status: TaskStatus = "TODO",
    priority: TaskPriority = "MEDIUM",
    dueDate?: string
): Promise<Task> {
    const body: any = { projectId, title, status, priority };
    if (dueDate) body.dueDate = dueDate;
    const res = await api.post("/v1/tasks", body);
    return res.data;
}
