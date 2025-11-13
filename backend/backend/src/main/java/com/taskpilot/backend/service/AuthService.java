package com.taskpilot.backend.service;

import com.taskpilot.backend.dto.LoginRequest;
import com.taskpilot.backend.dto.LoginResponse;
import com.taskpilot.backend.model.User;
import com.taskpilot.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        // 1. Ищем пользователя по email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        // 2. Проверяем пароль
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // 3. Генерируем JWT по объекту User (ВАЖНО: передаём user, а не id/email)
        String token = jwtService.generateToken(user);

        // 4. Собираем ответ
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        // если в LoginResponse поле role — String:
        response.setRole(user.getRole().name());

        return response;
    }
}
