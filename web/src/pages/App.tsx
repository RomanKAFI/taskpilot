// web/src/pages/App.tsx

import { useState } from "react";
import KanbanBoard from "../components/KanbanBoard";
import Profile from "./Profile";

interface DashboardPageProps {
    currentUser: {
        token: string;
        userId: string;
        email: string;
        role: string;
    };
    onLogout: () => void;
}

type Tab = "dashboard" | "profile";

export default function DashboardPage({ currentUser, onLogout }: DashboardPageProps) {
    const [tab, setTab] = useState<Tab>("dashboard");
    const projectId = import.meta.env.VITE_PROJECT_ID as string;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top bar */}
            <header className="border-b bg-white">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
                            T
                        </div>
                        <span className="font-semibold text-sm">TaskPilot</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setTab("dashboard")}
                            className={
                                "px-3 py-1 rounded-full text-sm border " +
                                (tab === "dashboard"
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
                            }
                        >
                            Dashboard
                        </button>

                        <button
                            type="button"
                            onClick={() => setTab("profile")}
                            className={
                                "px-3 py-1 rounded-full text-sm border " +
                                (tab === "profile"
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50")
                            }
                        >
                            Profile
                        </button>

                        <button
                            type="button"
                            onClick={onLogout}
                            className="ml-4 px-3 py-1 rounded-full text-sm border border-gray-200 text-gray-700 hover:bg-gray-100"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main>
                {tab === "dashboard" ? (
                    <KanbanBoard projectId={projectId} />
                ) : (
                    <Profile user={{ email: currentUser.email, role: currentUser.role }} />
                )}
            </main>
        </div>
    );
}
