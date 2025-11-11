import { useEffect, useState, useMemo, useCallback } from "react";
import { Task, fetchTasks } from "../api/tasks";
import Spinner from "../components/Spinner";

type UserInfo = {
    name: string;
    role: string;
    email: string;
};

const PROJECT_ID = import.meta.env.VITE_PROJECT_ID as string;

const K_USER: UserInfo = {
    name: "Demo User",
    role: "Product Manager",
    email: "demo@taskpilot.local",
};

function isOverdue(task: Task): boolean {
    if (!task.dueDate) return false;
    if (task.status === "DONE") return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    return due < today;
}

export default function Profile() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);

    const loadTasks = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchTasks(PROJECT_ID);
            setTasks(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadTasks();
    }, [loadTasks]);

    const stats = useMemo(() => {
        const total = tasks.length;
        const todo = tasks.filter((t) => t.status === "TODO").length;
        const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
        const blocked = tasks.filter((t) => t.status === "BLOCKED").length;
        const done = tasks.filter((t) => t.status === "DONE").length;
        const overdue = tasks.filter((t) => isOverdue(t)).length;

        const byPriority = {
            high: tasks.filter((t) => t.priority === "HIGH").length,
            medium: tasks.filter((t) => t.priority === "MEDIUM").length,
            low: tasks.filter((t) => t.priority === "LOW").length,
        };

        const progress = total > 0 ? Math.round((done / total) * 100) : 0;

        return { total, todo, inProgress, blocked, done, overdue, byPriority, progress };
    }, [tasks]);

    const recentTasks = useMemo(
        () =>
            [...tasks]
                .sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                .slice(0, 5),
        [tasks]
    );

    return (
        <main className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-2">Profile</h1>

            <p className="text-xs text-gray-500 mb-4">
                Project: <code>{PROJECT_ID}</code>
            </p>

            {/* User card */}
            <section className="bg-white border rounded-lg p-4 mb-4">
                <h2 className="font-semibold mb-3 text-sm">User</h2>
                <div className="text-sm space-y-1">
                    <div>
                        <div className="text-[11px] text-gray-400 uppercase">Name</div>
                        <div>{K_USER.name}</div>
                    </div>
                    <div>
                        <div className="text-[11px] text-gray-400 uppercase">Role</div>
                        <div>{K_USER.role}</div>
                    </div>
                    <div>
                        <div className="text-[11px] text-gray-400 uppercase">Email</div>
                        <div>{K_USER.email}</div>
                    </div>
                </div>
            </section>

            {/* Overview card */}
            <section className="bg-white border rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-sm">Overview</h2>
                    <button
                        type="button"
                        onClick={() => void loadTasks()}
                        className="text-xs border rounded px-2 py-1 text-gray-600 hover:bg-gray-50"
                    >
                        Refresh
                    </button>
                </div>

                {loading && (
                    <div className="mb-3">
                        <Spinner />
                    </div>
                )}

                <div className="text-sm mb-2 flex flex-wrap gap-3">
          <span>
            <span className="font-semibold">Tasks:</span> {stats.total}
          </span>
                    <span>
            <span className="font-semibold">TODO:</span> {stats.todo}
          </span>
                    <span>
            <span className="font-semibold">In progress:</span>{" "}
                        {stats.inProgress}
          </span>
                    <span>
            <span className="font-semibold">Blocked:</span> {stats.blocked}
          </span>
                    <span>
            <span className="font-semibold">Done:</span> {stats.done}
          </span>
                    <span>
            <span className="font-semibold">Overdue:</span> {stats.overdue}
          </span>
                </div>

                <div className="mt-2">
                    <div className="text-xs mb-1">
                        Progress: <span className="font-semibold">{stats.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${stats.progress}%` }}
                        />
                    </div>
                </div>
            </section>

            {/* By priority */}
            <section className="bg-white border rounded-lg p-4 mb-4">
                <h2 className="font-semibold text-sm mb-2">By priority</h2>
                <div className="text-sm flex gap-4 flex-wrap">
          <span>
            <span className="font-semibold">High:</span>{" "}
              {stats.byPriority.high}
          </span>
                    <span>
            <span className="font-semibold">Medium:</span>{" "}
                        {stats.byPriority.medium}
          </span>
                    <span>
            <span className="font-semibold">Low:</span> {stats.byPriority.low}
          </span>
                </div>
            </section>

            {/* Recent tasks */}
            <section className="bg-white border rounded-lg p-4 mb-4">
                <h2 className="font-semibold text-sm mb-3">Recent tasks</h2>

                {recentTasks.length === 0 && (
                    <p className="text-xs text-gray-400">No tasks yet.</p>
                )}

                <div className="space-y-2">
                    {recentTasks.map((t) => (
                        <div
                            key={t.id}
                            className="border rounded-lg px-3 py-2 bg-gray-50 text-sm"
                        >
                            <div className="font-medium mb-1">{t.title}</div>

                            <div className="text-[11px] text-gray-500 mb-1 flex flex-wrap gap-2">
                                <span>Status: {t.status}</span>
                                <span>Priority: {t.priority}</span>
                                {t.dueDate && <span>Due: {t.dueDate}</span>}
                                {isOverdue(t) && (
                                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-300">
                    Overdue
                  </span>
                                )}
                            </div>

                            <div className="text-[11px] text-gray-400">
                                Created at: {new Date(t.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
