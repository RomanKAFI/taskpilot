// web/src/components/KanbanBoard.tsx
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Task, TaskStatus, TaskPriority } from "../api/tasks";
import {
    fetchTasks,
    createTask,
    patchTaskStatus,
    deleteTask,
} from "../api/tasks";
import Spinner from "./Spinner";
import Toast from "./Toast";

type Props = {
    projectId: string;
};

type FilterStatus = "ALL" | TaskStatus;
type FilterPriority = "ALL" | TaskPriority;

const TASK_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "BLOCKED", "DONE"];
const TASK_PRIORITIES: TaskPriority[] = ["HIGH", "MEDIUM", "LOW"];

// простая проверка просроченности
function isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    if (task.status === "DONE") return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(task.dueDate);
    return due < today;
}

export default function KanbanBoard({ projectId }: Props) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    // форма создания
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState<TaskStatus>("TODO");
    const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
    const [dueDate, setDueDate] = useState("");

    // фильтры
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
    const [filterPriority, setFilterPriority] =
        useState<FilterPriority>("ALL");
    const [onlyOverdue, setOnlyOverdue] = useState(false);

    // загрузка задач
    const loadTasks = async () => {
        setLoading(true);
        try {
            const data = await fetchTasks(projectId);
            setTasks(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadTasks();
    }, [projectId]);

    // какие задачи видим с учётом фильтров
    const visibleTasks = useMemo(() => {
        return tasks.filter((t) => {
            if (filterStatus !== "ALL" && t.status !== filterStatus) return false;
            if (filterPriority !== "ALL" && t.priority !== filterPriority)
                return false;
            if (onlyOverdue && !isOverdue(t)) return false;
            return true;
        });
    }, [tasks, filterStatus, filterPriority, onlyOverdue]);

    // статистика по видимым задачам
    const stats = useMemo(() => {
        const total = visibleTasks.length;
        const todo = visibleTasks.filter((t) => t.status === "TODO").length;
        const inProgress = visibleTasks.filter(
            (t) => t.status === "IN_PROGRESS",
        ).length;
        const blocked = visibleTasks.filter(
            (t) => t.status === "BLOCKED",
        ).length;
        const done = visibleTasks.filter((t) => t.status === "DONE").length;

        const progress = total ? Math.round((done / total) * 100) : 0;

        return { total, todo, inProgress, blocked, done, progress };
    }, [visibleTasks]);

    // создать задачу
    const handleAddTask = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            await createTask({
                projectId,
                title: title.trim(),
                status,
                priority,
                dueDate: dueDate || null,
            });

            setTitle("");
            setStatus("TODO");
            setPriority("MEDIUM");
            setDueDate("");
            setToast("Task added successfully!");
            await loadTasks();
        } catch {
            setToast("Error adding task!");
        }
    };

    // смена статуса
    const handleStatusChange = async (
        taskId: string,
        newStatus: TaskStatus,
    ) => {
        try {
            await patchTaskStatus(taskId, newStatus);
            await loadTasks();
        } catch {
            setToast("Error updating task!");
        }
    };

    // удаление
    const handleDelete = async (taskId: string) => {
        const snapshot = tasks;
        setTasks((prev) => prev.filter((t) => t.id !== taskId));

        try {
            await deleteTask(taskId);
            setToast("Task deleted");
        } catch {
            setTasks(snapshot);
            setToast("Error deleting task!");
        }
    };

    const resetFilters = () => {
        setFilterStatus("ALL");
        setFilterPriority("ALL");
        setOnlyOverdue(false);
    };

    return (
        <div className="p-4">
            {/* панель статистики */}
            <div className="flex flex-wrap items-center gap-3 mb-2 text-sm">
        <span>
          Total: {stats.total} • TODO: {stats.todo} • In progress:{" "}
            {stats.inProgress} • Blocked: {stats.blocked} • Done:{" "}
            {stats.done}
        </span>
                <span className="ml-auto font-semibold">
          Progress: {stats.progress}%
        </span>
            </div>

            <div className="mb-4">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all"
                        style={{ width: `${stats.progress}%` }}
                    />
                </div>
            </div>

            {/* панель фильтров */}
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Status:</span>
                    <select
                        className="border rounded px-2 py-1 text-xs"
                        value={filterStatus}
                        onChange={(e) =>
                            setFilterStatus(e.target.value as FilterStatus)
                        }
                    >
                        <option value="ALL">All</option>
                        {TASK_STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Priority:</span>
                    <select
                        className="border rounded px-2 py-1 text-xs"
                        value={filterPriority}
                        onChange={(e) =>
                            setFilterPriority(e.target.value as FilterPriority)
                        }
                    >
                        <option value="ALL">All</option>
                        {TASK_PRIORITIES.map((p) => (
                            <option key={p} value={p}>
                                {p}
                            </option>
                        ))}
                    </select>
                </div>

                <label className="flex items-center gap-1 text-xs text-gray-600">
                    <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={onlyOverdue}
                        onChange={(e) => setOnlyOverdue(e.target.checked)}
                    />
                    Only overdue
                </label>

                <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs text-gray-500 underline"
                >
                    Reset
                </button>
            </div>

            {loading && <Spinner />}

            {/* колонки */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TASK_STATUSES.map((col) => {
                    const tasksInCol = visibleTasks.filter(
                        (t) => t.status === col,
                    );

                    return (
                        <div
                            key={col}
                            className="border rounded-lg bg-white p-3 shadow-sm"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="font-semibold text-sm">{col}</h2>
                                <button
                                    type="button"
                                    onClick={loadTasks}
                                    className="text-xs text-gray-400 border rounded px-2 py-0.5 hover:bg-gray-50"
                                >
                                    Refresh
                                </button>
                            </div>

                            {/* форма создания — только в TODO */}
                            {col === "TODO" && (
                                <form
                                    onSubmit={handleAddTask}
                                    className="mb-3 space-y-2 border-b pb-3"
                                >
                                    <input
                                        className="border p-1 w-full rounded text-sm"
                                        placeholder="New task title..."
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />

                                    <div className="flex gap-2">
                                        <select
                                            className="border rounded p-1 flex-1 text-xs"
                                            value={status}
                                            onChange={(e) =>
                                                setStatus(e.target.value as TaskStatus)
                                            }
                                        >
                                            {TASK_STATUSES.map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            className="border rounded p-1 flex-1 text-xs"
                                            value={priority}
                                            onChange={(e) =>
                                                setPriority(e.target.value as TaskPriority)
                                            }
                                        >
                                            {TASK_PRIORITIES.map((p) => (
                                                <option key={p} value={p}>
                                                    {p}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <input
                                        type="date"
                                        className="border p-1 w-full rounded text-sm"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                    />

                                    <button
                                        type="submit"
                                        className="w-full bg-black text-white py-1 rounded text-sm"
                                    >
                                        Add task
                                    </button>
                                </form>
                            )}

                            {/* задачи в колонке */}
                            {tasksInCol.length === 0 && (
                                <p className="text-xs text-gray-400">No tasks</p>
                            )}

                            {tasksInCol.map((task) => (
                                <div
                                    key={task.id}
                                    className="border rounded p-2 mb-2 bg-gray-50 relative"
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(task.id)}
                                        className="absolute right-1 top-1 text-[10px] text-gray-400 hover:text-red-500"
                                    >
                                        ✕
                                    </button>

                                    <div className="font-semibold text-sm mb-1 pr-4">
                                        {task.title}
                                    </div>

                                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                        {task.dueDate && <span>Due: {task.dueDate}</span>}
                                        <span>Priority: {task.priority}</span>
                                        {isOverdue(task) && (
                                            <span className="ml-auto px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-300">
                        Overdue
                      </span>
                                        )}
                                    </div>

                                    <div className="flex gap-1 mt-2 flex-wrap">
                                        {TASK_STATUSES.map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() =>
                                                    handleStatusChange(task.id, s)
                                                }
                                                className={`text-[11px] px-2 py-0.5 rounded border ${
                                                    task.status === s
                                                        ? "bg-black text-white"
                                                        : "bg-white text-gray-700"
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            {toast && (
                <Toast message={toast} onClose={() => setToast(null)} />
            )}
        </div>
    );
}
