package com.taskpilot.backend.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class LoginResponse {

    /**
     * JWT-токен, который фронт будет отправлять в заголовке Authorization.
     */
    private String token;

    /**
     * ID пользователя, который залогинился.
     */
    private UUID userId;

    /**
     * Email пользователя.
     */
    private String email;

    /**
     * Роль пользователя: например, "ADMIN", "EMPLOYEE" и т.п.
     */
    private String role;
}
