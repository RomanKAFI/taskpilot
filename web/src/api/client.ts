// web/src/api/client.ts
import axios from "axios";

const client = axios.create({
    baseURL: "/api/v1", // ВАЖНО: тут /api/v1, а не просто /api
    headers: {
        "Content-Type": "application/json",
    },
});

export default client;
