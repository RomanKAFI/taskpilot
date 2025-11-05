import KanbanBoard from "../components/KanbanBoard";

export default function Dashboard() {
    const projectId = import.meta.env.VITE_PROJECT_ID as string;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <p className="mb-2 text-sm text-gray-600">
                Project: <code>{projectId}</code>
            </p>
            <KanbanBoard projectId={projectId} />
        </div>
    );
}
