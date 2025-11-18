// web/src/pages/Profile.tsx

interface ProfileProps {
    user: {
        email: string;
        role: string;
    };
}

export default function Profile({ user }: ProfileProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-6">
                <h1 className="text-2xl font-semibold mb-4">Profile</h1>
                <p className="text-sm text-gray-500 mb-6">
                    Project: {import.meta.env.VITE_PROJECT_ID}
                </p>

                {/* User card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">User</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="text-gray-500 uppercase text-xs">Name</div>
                            <div className="font-medium">Admin</div>
                            {/* позже можно подставлять реальное имя из backend */}
                        </div>

                        <div>
                            <div className="text-gray-500 uppercase text-xs">Role</div>
                            <div className="font-medium">{user.role}</div>
                        </div>

                        <div>
                            <div className="text-gray-500 uppercase text-xs">Email</div>
                            <div className="font-medium">{user.email}</div>
                        </div>
                    </div>
                </div>

                {/* Overview – пока как в демо, все нули */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Overview</h2>
                        <button className="text-xs text-gray-500 hover:text-gray-800">
                            Refresh
                        </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm">
                        <div>
                            <div className="text-gray-500 text-xs uppercase">Tasks</div>
                            <div className="font-semibold">0</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs uppercase">TODO</div>
                            <div className="font-semibold">0</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs uppercase">In progress</div>
                            <div className="font-semibold">0</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs uppercase">Blocked</div>
                            <div className="font-semibold">0</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs uppercase">Done</div>
                            <div className="font-semibold">0</div>
                        </div>
                    </div>
                </div>

                {/* By priority – тоже чисто визуальный блок */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">By priority</h2>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <div className="text-gray-500 text-xs uppercase">High</div>
                            <div className="font-semibold">0</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs uppercase">Medium</div>
                            <div className="font-semibold">0</div>
                        </div>
                        <div>
                            <div className="text-gray-500 text-xs uppercase">Low</div>
                            <div className="font-semibold">0</div>
                        </div>
                    </div>
                </div>

                {/* Recent tasks */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-2">Recent tasks</h2>
                    <p className="text-sm text-gray-500">No tasks yet.</p>
                </div>
            </div>
        </div>
    );
}
