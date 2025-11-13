package com.taskpilot.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateUserRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String name;

    /**
     * Роль в виде строки: "EMPLOYEE", "MANAGER", "ADMIN" и т.п.
     * В сервисе мы превратим её в enum UserRole.
     */
    @NotBlank
    private String role;

    /**
     * Необязательный менеджер. Может быть null.
     */
    private UUID managerId;
}
