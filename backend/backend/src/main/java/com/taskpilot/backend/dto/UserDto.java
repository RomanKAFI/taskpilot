package com.taskpilot.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
public class UserDto {
    private UUID id;
    private String name;
    private String email;
    /** Роль как строка (имя enum) */
    private String role;
    private UUID managerId;
    private Instant createdAt;
}
