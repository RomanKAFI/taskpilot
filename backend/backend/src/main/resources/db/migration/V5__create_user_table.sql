-- V5__create_user_table.sql

CREATE TABLE IF NOT EXISTS app_user (
                                        id         UUID PRIMARY KEY,
                                        name       TEXT                NOT NULL,
                                        email      TEXT                NOT NULL UNIQUE,
                                        role       TEXT                NOT NULL,
                                        manager_id UUID                NULL REFERENCES app_user(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ         NOT NULL DEFAULT now()
    );
