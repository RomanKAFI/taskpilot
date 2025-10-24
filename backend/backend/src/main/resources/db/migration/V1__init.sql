-- Enums
CREATE TYPE task_status AS ENUM ('TODO','IN_PROGRESS','BLOCKED','DONE');
CREATE TYPE user_role   AS ENUM ('ADMIN','MANAGER','EMPLOYEE');

-- Users
CREATE TABLE app_user (
                          id            UUID PRIMARY KEY,
                          email         TEXT UNIQUE NOT NULL,
                          password_hash TEXT NOT NULL,
                          role          user_role NOT NULL DEFAULT 'EMPLOYEE',
                          created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Goals
CREATE TABLE goal (
                      id          UUID PRIMARY KEY,
                      title       TEXT NOT NULL,
                      description TEXT,
                      owner_id    UUID REFERENCES app_user(id),
                      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Projects
CREATE TABLE project (
                         id          UUID PRIMARY KEY,
                         goal_id     UUID NOT NULL REFERENCES goal(id) ON DELETE CASCADE,
                         title       TEXT NOT NULL,
                         description TEXT,
                         created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tasks
CREATE TABLE task (
                      id           UUID PRIMARY KEY,
                      project_id   UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
                      title        TEXT NOT NULL,
                      description  TEXT,
                      assignee_id  UUID REFERENCES app_user(id),
                      status       task_status NOT NULL DEFAULT 'TODO',
                      due_date     DATE,
                      created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Subtasks
CREATE TABLE subtask (
                         id           UUID PRIMARY KEY,
                         task_id      UUID NOT NULL REFERENCES task(id) ON DELETE CASCADE,
                         title        TEXT NOT NULL,
                         status       task_status NOT NULL DEFAULT 'TODO',
                         created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_task_project  ON task(project_id);
CREATE INDEX idx_subtask_task  ON subtask(task_id);
CREATE INDEX idx_task_assignee ON task(assignee_id);
