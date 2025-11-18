// web/src/api/client.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const client = axios.create({
    baseURL: `${API_URL}/api/v1`,
    headers: {
        "Content-Type": "application/json",
    },
});

// Автоматически добавляем токен во все запросы
client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// При 401 — выкидываем токен и отправляем на /login
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            // можно потом поменять логику, когда будет роутинг
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default client;
