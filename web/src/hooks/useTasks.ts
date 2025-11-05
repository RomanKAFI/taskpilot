// web/src/hooks/useTasks.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    createTask,
    deleteTask,
    fetchTasks,
    patchTaskStatus,
    Task,
    TaskPriority,
    TaskStatus,
} from "../api/tasks";

export type LoadState<T> =
    | { state: "idle" }
    | { state: "loading" }
    | { state: "ready"; data: T }
    | { state: "error"; message: string };

export function useTasks(projectId: string) {
    const [items, setItems] = useState<Task[]>([]);
    const [load, setLoad] = useState<LoadState<Task[]>>({ state: "idle" });

    const [newTitle, setNewTitle] = useState("");
    const [newStatus, setNewStatus] = useState<TaskStatus>("TODO");
    const [newPriority, setNewPriority] = useState<TaskPriority>("MEDIUM");
    const [newDueDate, setNewDueDate] = useState<string>("");

    // группировка задач по статусам (TODO / IN_PROGRESS / BLOCKED / DONE)
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

    const loadAll = useCallback(async () => {
        try {
            setLoad({ state: "loading" });
            const data = await fetchTasks(projectId);
            setItems(data);
            setLoad({ state: "ready", data });
        } catch (e: any) {
            setLoad({
                state: "error",
                message: e?.message || "Failed to load tasks",
            });
        }
    }, [projectId]);

    useEffect(() => {
        void loadAll();
    }, [loadAll]);

    const onCreate = useCallback(async () => {
        if (!newTitle.trim()) return;

        const title = newTitle.trim();
        const status = newStatus;
        const priority = newPriority;
        const dueDate = newDueDate || undefined;

        const temp: Task = {
            id: "temp-" + Math.random().toString(36).slice(2),
            projectId,
            title,
            description: null,
            status,
            assigneeId: null,
            dueDate: dueDate ?? null,
            priority,
            createdAt: new Date().toISOString(),
        };

        setItems((prev) => [temp, ...prev]);
        setNewTitle("");

        try {
            const created = await createTask(
                projectId,
                title,
                status,
                priority,
                dueDate
            );
            setItems((prev) =>
                prev.map((t) => (t.id === temp.id ? created : t))
            );
            window.dispatchEvent(
                new CustomEvent("toast", {
                    detail: { type: "success", text: "Task created" },
                })
            );
        } catch (e: any) {
            setItems((prev) => prev.filter((t) => t.id !== temp.id));
            window.dispatchEvent(
                new CustomEvent("toast", {
                    detail: { type: "error", text: e?.message || "Create failed" },
                })
            );
        }
    }, [newTitle, newStatus, newPriority, newDueDate, projectId]);

    const onMove = useCallback(
        async (id: string, dir: -1 | 1) => {
            const ORDER: TaskStatus[] = ["TODO", "IN_PROGRESS", "BLOCKED", "DONE"];
            const cur = items.find((t) => t.id === id);
            if (!cur) return;

            const i = ORDER.indexOf(cur.status);
            const j = i + dir;
            if (j < 0 || j >= ORDER.length) return;

            const next = ORDER[j];
            const snapshot = items;

            setItems((prev) =>
                prev.map((t) => (t.id === id ? { ...t, status: next } : t))
            );

            try {
                await patchTaskStatus(id, next);
                window.dispatchEvent(
                    new CustomEvent("toast", {
                        detail: { type: "success", text: "Status updated" },
                    })
                );
            } catch (e: any) {
                setItems(snapshot);
                window.dispatchEvent(
                    new CustomEvent("toast", {
                        detail: { type: "error", text: e?.message || "Update failed" },
                    })
                );
            }
        },
        [items]
    );

    const onDelete = useCallback(
        async (id: string) => {
            const snapshot = items;
            setItems((prev) => prev.filter((t) => t.id !== id));

            try {
                await deleteTask(id);
                window.dispatchEvent(
                    new CustomEvent("toast", {
                        detail: { type: "success", text: "Task deleted" },
                    })
                );
            } catch (e: any) {
                setItems(snapshot);
                window.dispatchEvent(
                    new CustomEvent("toast", {
                        detail: { type: "error", text: e?.message || "Delete failed" },
                    })
                );
            }
        },
        [items]
    );

    return {
        byStatus,
        items,
        load,
        loadAll,
        newTitle,
        setNewTitle,
        newStatus,
        setNewStatus,
        newPriority,
        setNewPriority,
        newDueDate,
        setNewDueDate,
        onCreate,
        onMove,
        onDelete,
    };
}
