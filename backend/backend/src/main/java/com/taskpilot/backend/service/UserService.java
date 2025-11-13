package com.taskpilot.backend.service;

import com.taskpilot.backend.dto.CreateUserRequest;
import com.taskpilot.backend.dto.UserDto;
import com.taskpilot.backend.model.User;
import com.taskpilot.backend.model.UserRole;
import com.taskpilot.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    public UserDto getUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + id));
        return toDto(user);
    }

    public UserDto createUser(CreateUserRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // 🔹 Преобразуем строку "EMPLOYEE"/"MANAGER" → enum UserRole
        UserRole role = UserRole.valueOf(request.getRole().toUpperCase());
        user.setRole(role);

        if (request.getManagerId() != null) {
            User manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new IllegalArgumentException("Manager not found: " + request.getManagerId()));
            user.setManager(manager);
        }

        String rawPassword = "temp-" + UUID.randomUUID().toString().substring(0, 8);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setCreatedAt(Instant.now());

        User saved = userRepository.save(user);

        System.out.println("TEMP PASSWORD for " + saved.getEmail() + " = " + rawPassword);

        return toDto(saved);
    }

    public void changePassword(UUID userId, String newRawPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        String hash = passwordEncoder.encode(newRawPassword);
        user.setPasswordHash(hash);
        userRepository.save(user);
    }

    private UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());

        // 🔹 enum → строка
        if (user.getRole() != null) {
            dto.setRole(user.getRole().name());
        }

        dto.setCreatedAt(user.getCreatedAt());

        if (user.getManager() != null) {
            dto.setManagerId(user.getManager().getId());
        }

        return dto;
    }
}
