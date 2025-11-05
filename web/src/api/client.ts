// web/src/api/client.ts
import axios from "axios";

// Всегда идём через Vite-прокси на /api
const api = axios.create({
    baseURL: "/api",
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((cfg) => {
    const method = (cfg.method ?? "get").toUpperCase();
    const base = cfg.baseURL ?? "";
    const url = cfg.url ?? "";
    console.debug(`[API] → ${method} ${base}${url}`, cfg.data ?? "");
    return cfg;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const msg =
            err?.response?.data?.message ||
            err?.message ||
            "Request failed";
        console.error("[API] ✖", msg, err?.response || err);
        return Promise.reject(err);
    }
);

export default api;
