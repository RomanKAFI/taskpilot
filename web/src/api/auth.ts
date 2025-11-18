// web/src/api/auth.ts
import client from "./client";

export interface LoginResponse {
    token: string;
    userId: string;
    email: string;
    role: string;
}

export async function login(
    email: string,
    password: string
): Promise<LoginResponse> {
    const response = await client.post<LoginResponse>("/auth/login", {
        email,
        password,
    });
    return response.data;
}
