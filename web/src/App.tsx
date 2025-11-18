// web/src/App.tsx
import { useEffect, useState } from "react";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/App";
import type { LoginResponse } from "./api/auth";

function App() {
    const [auth, setAuth] = useState<LoginResponse | null>(null);

    // Читаем пользователя из localStorage при старте
    useEffect(() => {
        const userRaw = localStorage.getItem("user");
        if (userRaw) {
            try {
                const user = JSON.parse(userRaw) as LoginResponse;
                setAuth(user);
            } catch {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
    }, []);

    const handleLoginSuccess = (data: LoginResponse) => {
        // LoginPage уже положил token и user в localStorage
        setAuth(data);
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setAuth(null);
    };

    if (!auth) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return <DashboardPage currentUser={auth} onLogout={handleLogout} />;
}

export default App;
