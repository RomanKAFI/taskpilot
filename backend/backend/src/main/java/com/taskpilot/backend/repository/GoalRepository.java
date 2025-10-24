package com.taskpilot.backend.repository;

import com.taskpilot.backend.model.Goal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface GoalRepository extends JpaRepository<Goal, UUID> {}
