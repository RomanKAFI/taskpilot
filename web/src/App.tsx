

import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

type Page = "dashboard" | "profile";

export default function App() {
    const [page, setPage] = useState<Page>("dashboard");

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            {/* Верхний бар */}
            <header className="border-b bg-white">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                            T
                        </div>
                        <span className="font-semibold text-sm">TaskPilot</span>
                    </div>

                    <nav className="flex gap-2 text-sm">
                        <button
                            type="button"
                            onClick={() => setPage("dashboard")}
                            className={
                                "px-3 py-1 rounded-full border text-xs " +
                                (page === "dashboard"
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100")
                            }
                        >
                            Dashboard
                        </button>
                        <button
                            type="button"
                            onClick={() => setPage("profile")}
                            className={
                                "px-3 py-1 rounded-full border text-xs " +
                                (page === "profile"
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100")
                            }
                        >
                            Profile
                        </button>
                    </nav>
                </div>
            </header>

            <main className="max-w-5xl mx-auto">
                {page === "dashboard" ? <Dashboard /> : <Profile />}
            </main>
        </div>
    );
}
