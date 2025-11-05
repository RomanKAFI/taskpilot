import { useEffect, useState } from "react";
import {
    Task,
    TaskStatus,
    TaskPriority,
    fetchTasks,
    createTask,
    patchTaskStatus,
} from "../api/tasks";

type Props = {
    projectId: string;
};

export default function KanbanBoard({ projectId }: Props) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);

    // поля формы
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState<TaskStatus>("TODO");
    const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
    const [dueDate, setDueDate] = useState<string>("");

    // загрузка задач
    const loadTasks = async () => {
        setLoading(true);
        try {
            const data = await fetchTasks(projectId);
            setTasks(data);
        } catch (e) {
            console.error("Failed to load tasks", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadTasks();
    }, [projectId]);

    // создание задачи
    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            await createTask(
                projectId,
                title.trim(),
                status,
                priority,
                dueDate || undefined
            );

            // очистка формы
            setTitle("");
            setStatus("TODO");
            setPriority("MEDIUM");
            setDueDate("");

            // перезагрузим задачи
            await loadTasks();
        } catch (e) {
            console.error("Failed to create task", e);
        }
    };

    // смена статуса
    const handleChangeStatus = async (taskId: string, newStatus: TaskStatus) => {
        try {
            await patchTaskStatus(taskId, newStatus);
            await loadTasks();
        } catch (e) {
            console.error("Failed to update status", e);
        }
    };

    const columns: { key: TaskStatus; title: string }[] = [
        { key: "TODO",        title: "TODO" },
        { key: "IN_PROGRESS", title: "IN PROGRESS" },
        { key: "BLOCKED",     title: "BLOCKED" },
        { key: "DONE",        title: "DONE" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            {columns.map((col) => {
                const colTasks = tasks.filter((t) => t.status === col.key);

                return (
                    <div key={col.key} className="bg-gray-50 border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-semibold text-sm">{col.title}</h2>
                            <button
                                type="button"
                                className="text-xs text-gray-500"
                                onClick={loadTasks}
                            >
                                Refresh
                            </button>
                        </div>

                        {/* форма создания задачи — только в колонке TODO */}
                        {col.key === "TODO" && (
                            <form
                                onSubmit={handleCreateTask}
                                className="mb-3 space-y-2 border-b pb-3"
                            >
                                <input
                                    type="text"
                                    className="w-full border rounded px-2 py-1 text-sm"
                                    placeholder="New task title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />

                                <div className="flex gap-2">
                                    <select
                                        className="flex-1 border rounded px-2 py-1 text-sm"
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(e.target.value as TaskStatus)
                                        }
                                    >
                                        <option value="TODO">TODO</option>
                                        <option value="IN_PROGRESS">IN PROGRESS</option>
                                        <option value="BLOCKED">BLOCKED</option>
                                        <option value="DONE">DONE</option>
                                    </select>

                                    <select
                                        className="flex-1 border rounded px-2 py-1 text-sm"
                                        value={priority}
                                        onChange={(e) =>
                                            setPriority(e.target.value as TaskPriority)
                                        }
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                    </select>
                                </div>

                                <input
                                    type="date"
                                    className="w-full border rounded px-2 py-1 text-sm"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />

                                <button
                                    type="submit"
                                    className="w-full bg-black text-white text-sm py-1 rounded"
                                    disabled={loading}
                                >
                                    Add task
                                </button>
                            </form>
                        )}

                        {/* список задач в колонке */}
                        <div className="space-y-2">
                            {colTasks.length === 0 && (
                                <p className="text-xs text-gray-400">No tasks</p>
                            )}

                            {colTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="bg-white border rounded px-2 py-2 text-sm"
                                >
                                    <div className="font-medium text-sm">{task.title}</div>
                                    {task.description && (
                                        <div className="text-xs text-gray-500">
                                            {task.description}
                                        </div>
                                    )}

                                    <div className="mt-1 text-[11px] text-gray-500">
                                        {task.dueDate && <>Due: {task.dueDate} • </>}
                                        Priority: {task.priority}
                                    </div>

                                    {/* кнопки смены статуса */}
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {columns.map((c) => (
                                            <button
                                                key={c.key}
                                                type="button"
                                                className={`border rounded px-1.5 py-0.5 text-[10px] ${
                                                    task.status === c.key
                                                        ? "bg-black text-white"
                                                        : "bg-white text-gray-600"
                                                }`}
                                                onClick={() => handleChangeStatus(task.id, c.key)}
                                            >
                                                {c.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
