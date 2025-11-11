// web/src/hooks/useTasks.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Task,
    TaskStatus,
    TaskPriority,
    fetchTasks,
    patchTaskStatus,
    deleteTask,
    createTask,
} from "../api/tasks";

const STATUS_ORDER: TaskStatus[] = ["TODO", "IN_PROGRESS", "BLOCKED", "DONE"];

export function useTasks(projectId: string) {
    const [items, setItems] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [newTitle, setNewTitle] = useState("");
    const [newStatus, setNewStatus] = useState<TaskStatus>("TODO");
    const [newPriority, setNewPriority] = useState<TaskPriority>("MEDIUM");
    const [newDueDate, setNewDueDate] = useState<string>("");

    // --- группировка по статусам ---
    const byStatus = useMemo(() => {
        const map: Record<TaskStatus, Task[]> = {
            TODO: [],
            IN_PROGRESS: [],
            BLOCKED: [],
            DONE: [],
        };
        for (const t of items) {
            map[t.status].push(t);
        }
        return map;
    }, [items]);

    // --- загрузка всех задач ---
    const loadAll = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchTasks(projectId);
            setItems(data);
        } catch (e: any) {
            setError(e?.message || "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        void loadAll();
    }, [loadAll]);

    // --- создание задачи ---
    const onCreate = useCallback(async () => {
        const title = newTitle.trim();
        if (!title) return;

        const dueDateValue: string | null = newDueDate || null;

        const temp: Task = {
            id: "temp-" + Math.random().toString(36).slice(2),
            projectId,
            title,
            status: newStatus,
            priority: newPriority,
            dueDate: dueDateValue,
            createdAt: new Date().toISOString(),
        };

        // оптимистично добавляем
        setItems((prev) => [temp, ...prev]);
        setNewTitle("");

        try {
            const created = await createTask({
                projectId,
                title,
                status: newStatus,
                priority: newPriority,
                dueDate: dueDateValue,
            });

            setItems((prev) => prev.map((t) => (t.id === temp.id ? created : t)));
        } catch (e: any) {
            // откатываем
            setItems((prev) => prev.filter((t) => t.id !== temp.id));
            setError(e?.message || "Failed to create task");
        }
    }, [newTitle, newStatus, newPriority, newDueDate, projectId]);

    // --- смена статуса (влево/вправо) ---
    const onMove = useCallback(
        async (id: string, dir: -1 | 1) => {
            const cur = items.find((t) => t.id === id);
            if (!cur) return;

            const i = STATUS_ORDER.indexOf(cur.status);
            const j = i + dir;
            if (j < 0 || j >= STATUS_ORDER.length) return;

            const nextStatus = STATUS_ORDER[j];
            const snapshot = items;

            setItems((prev) =>
                prev.map((t) =>
                    t.id === id ? { ...t, status: nextStatus } : t,
                ),
            );

            try {
                await patchTaskStatus(id, nextStatus);
            } catch (e: any) {
                // если бекенд упал — откатываем список
                setItems(snapshot);
                setError(e?.message || "Failed to update status");
            }
        },
        [items],
    );

    // --- удаление задачи ---
    const onDelete = useCallback(
        async (id: string) => {
            const snapshot = items;
            setItems((prev) => prev.filter((t) => t.id !== id));

            try {
                await deleteTask(id);
            } catch (e: any) {
                setItems(snapshot);
                setError(e?.message || "Failed to delete task");
            }
        },
        [items],
    );

    return {
        // данные
        items,
        byStatus,

        // состояние загрузки
        loading,
        error,
        loadAll,

        // поля формы
        newTitle,
        setNewTitle,
        newStatus,
        setNewStatus,
        newPriority,
        setNewPriority,
        newDueDate,
        setNewDueDate,

        // действия
        onCreate,
        onMove,
        onDelete,
    };
}
