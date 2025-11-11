import KanbanBoard from "../components/KanbanBoard";

export default function Dashboard() {
    const projectId = import.meta.env.VITE_PROJECT_ID as string;

    return (
        <main className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-2">Dashboard</h1>

            <p className="text-xs text-gray-500 mb-4">
                Project: <code>{projectId}</code>
            </p>

            <KanbanBoard projectId={projectId} />
        </main>
    );
}
